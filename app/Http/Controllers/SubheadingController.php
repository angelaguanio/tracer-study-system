<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSubheadingRequest;
use App\Http\Requests\UpdateSubheadingRequest;
use App\Models\Section;
use App\Models\Subheading;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SubheadingController extends Controller
{
    use AuthorizesRequests;

    /**
     * Store a new subheading in the section
     */
    public function store(StoreSubheadingRequest $request, Section $section)
    {
        $this->authorize('update', $section->survey);

        $nextOrder = max(
            $section->questions()->max('display_order') ?? 0,
            $section->subheadings()->max('display_order') ?? 0
        ) + 1;

        $slug = $this->generateUniqueSlug($request->label, $section->survey_id);

        $subheading = $section->subheadings()->create([
            'subheading_identifier' => $slug,
            'label' => $request->label,
            'display_order' => $nextOrder,
        ]);

        return back()->with('subheading', $subheading);
    }

    /**
     * Update a subheading
     */
    public function update(UpdateSubheadingRequest $request, Subheading $subheading)
    {
        $this->authorize('update', $subheading->section->survey);

        $data = $request->validated();

        if ($request->has('label') && $request->label !== $subheading->label) {
            $data['subheading_identifier'] = $this->generateUniqueSlug(
                $request->label,
                $subheading->section->survey_id,
                $subheading->id
            );
        }

        $subheading->update($data);

        return back();
    }

    /**
     * Delete a subheading and resequence remaining items
     */
    public function destroy(Subheading $subheading)
    {
        $this->authorize('update', $subheading->section->survey);

        $sectionId = $subheading->section_id;
        $deletedOrder = $subheading->display_order;

        DB::transaction(function () use ($subheading, $sectionId, $deletedOrder) {
            $subheading->delete();

            // Resequence remaining subheadings
            Subheading::where('section_id', $sectionId)
                ->where('display_order', '>', $deletedOrder)
                ->orderBy('display_order')
                ->get()
                ->each(function (Subheading $s, int $index) use ($deletedOrder) {
                    $s->update(['display_order' => $deletedOrder + $index]);
                });

            // Resequence questions that come after the deleted subheading
            $section = Section::find($sectionId);
            $section->questions()
                ->where('display_order', '>', $deletedOrder)
                ->orderBy('display_order')
                ->get()
                ->each(function ($q, int $index) use ($deletedOrder) {
                    $q->update(['display_order' => $deletedOrder + $index]);
                });
        });

        return back();
    }

    /**
     * Reorder subheadings and questions together
     */
    public function reorder(Request $request, Section $section)
    {
        $this->authorize('update', $section->survey);

        $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'integer'],
            'items.*.type' => ['required', 'in:question,subheading'],
            'items.*.display_order' => ['required', 'integer', 'min:1'],
        ]);

        DB::transaction(function () use ($request, $section) {
            foreach ($request->items as $item) {
                if ($item['type'] === 'subheading') {
                    $section->subheadings()
                        ->where('id', $item['id'])
                        ->update(['display_order' => $item['display_order']]);
                } else {
                    $section->questions()
                        ->where('id', $item['id'])
                        ->update(['display_order' => $item['display_order']]);
                }
            }
        });

        return back();
    }

    /**
     * Generate a unique subheading identifier slug
     */
    private function generateUniqueSlug(string $label, int $surveyId, ?int $excludeSubheadingId = null): string
    {
        $base = Str::slug($label);
        $slug = $base;
        $i = 2;

        while (
            Subheading::whereHas('section', fn ($q) => $q->where('survey_id', $surveyId))
                ->where('subheading_identifier', $slug)
                ->when($excludeSubheadingId, fn ($q) => $q->where('id', '!=', $excludeSubheadingId))
                ->exists()
        ) {
            $slug = $base . '-' . $i++;
        }

        return $slug;
    }
}