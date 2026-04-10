<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSectionRequest;
use App\Models\Section;
use App\Models\Survey;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SectionController extends Controller
{
    use AuthorizesRequests;

    /**
     * Store a new section, appending display_order after the last existing section.
     * Req 2.1, 2.6
     */
    public function store(StoreSectionRequest $request, Survey $survey)
    {
        $this->authorize('update', $survey);

        $nextOrder = $survey->sections()->max('display_order') + 1;

        $section = $survey->sections()->create([
            'title'         => $request->title,
            'description'   => $request->description,
            'likert_scale'  => $request->likert_scale,
            'display_order' => $nextOrder,
        ]);

        return back()->with('section', $section);
    }

    /**
     * Rename a section title while preserving questions and responses.
     * Req 2.2
     */
    public function update(Request $request, Section $section)
    {
        $this->authorize('update', $section->survey);

        $request->validate([
            'title' => [
                'required',
                'string',
                'max:255',
                \Illuminate\Validation\Rule::unique('sections')
                    ->where('survey_id', $section->survey_id)
                    ->ignore($section->id),
            ],
            'description'    => ['nullable', 'string'],
            'likert_scale'   => ['nullable', 'array'],
            'likert_scale.*' => ['string', 'max:255'],
        ]);

        $section->update([
            'title'        => $request->title,
            'description'  => $request->description,
            'likert_scale' => $request->likert_scale,
        ]);

        return back();
    }

    /**
     * Bulk-update display_order of all sections atomically.
     * Req 2.3
     *
     * Expects: { sections: [ { id: int, display_order: int }, ... ] }
     */
    public function reorder(Request $request, Survey $survey)
    {
        $this->authorize('update', $survey);

        $request->validate([
            'sections'                  => ['required', 'array'],
            'sections.*.id'             => ['required', 'integer', 'exists:sections,id'],
            'sections.*.display_order'  => ['required', 'integer', 'min:1'],
        ]);

        DB::transaction(function () use ($request, $survey) {
            foreach ($request->sections as $item) {
                $survey->sections()
                    ->where('id', $item['id'])
                    ->update(['display_order' => $item['display_order']]);
            }
        });

        return back();
    }

    /**
     * Delete a section if it has no questions; resequence remaining sections.
     * Req 2.4, 2.5
     */
    public function destroy(Section $section)
    {
        $this->authorize('update', $section->survey);

        if ($section->questions()->exists()) {
            return back()->withErrors([
                'section' => 'Cannot delete a section that contains questions. Remove or reassign all questions first.',
            ]);
        }

        $surveyId = $section->survey_id;
        $deletedOrder = $section->display_order;

        DB::transaction(function () use ($section, $surveyId, $deletedOrder) {
            $section->delete();

            // Resequence remaining sections
            Section::where('survey_id', $surveyId)
                ->where('display_order', '>', $deletedOrder)
                ->orderBy('display_order')
                ->get()
                ->each(function (Section $s, int $index) use ($deletedOrder) {
                    $s->update(['display_order' => $deletedOrder + $index]);
                });
        });

        return back();
    }
}
