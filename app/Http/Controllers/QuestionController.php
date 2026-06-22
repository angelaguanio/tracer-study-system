<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreQuestionRequest;
use App\Http\Requests\UpdateQuestionRequest;
use App\Models\Question;
use App\Models\Section;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class QuestionController extends Controller
{
    use AuthorizesRequests;

    /**
     * Store a new question in the section, appending display_order and generating
     * a unique question_identifier slug scoped to the parent survey.
     * Req 3.1, 3.7, 3.8
     */
    public function store(StoreQuestionRequest $request, Section $section)
    {
        $this->authorize('update', $section->survey);

        $nextOrder = max(
            $section->questions()->max('display_order') ?? 0,
            $section->subheadings()->max('display_order') ?? 0
        ) + 1;

        $slug = $this->generateUniqueSlug($request->label, $section->survey_id);

        $question = $section->questions()->create([
            'question_identifier' => $slug,
            'label'               => $request->label,
            'type'                => $request->type,
            'options'             => $request->options,
            'display_order'       => $nextOrder,
            'is_required'         => $request->boolean('is_required', false),
        ]);

        return back()->with('question', $question);
    }

    /**
     * Update a question's label, type, options, or required flag.
     * Re-generates question_identifier if label changes.
     * Req 3.2
     */
    public function update(UpdateQuestionRequest $request, Question $question)
    {
        $this->authorize('update', $question->section->survey);

        $data = $request->validated();
        $survey = $question->section->survey;

        // Structural lock: if responses exist, block type changes and option removal
        if ($survey->responses()->exists()) {
            // Block question type change
            if ($request->has('type') && $request->type !== $question->type) {
                return back()->withErrors([
                    'type' => 'The question type cannot be changed because responses already exist for this survey.',
                ]);
            }

            // Block removal of options that have been answered
            if ($request->has('options') && is_array($request->options)) {
                $currentOptions = $question->options ?? [];
                $removedOptions = array_values(array_diff($currentOptions, $request->options));

                if (!empty($removedOptions)) {
                    // Check if any response used a removed option
                    $hasAnsweredOption = $question->responses()
                        ->whereIn('answer_value', $removedOptions)
                        ->exists();

                    if ($hasAnsweredOption) {
                        return back()->withErrors([
                            'options' => 'One or more removed options have already been selected by respondents and cannot be deleted.',
                        ]);
                    }
                }
            }
        }

        if ($request->has('label') && $request->label !== $question->label) {
            $data['question_identifier'] = $this->generateUniqueSlug(
                $request->label,
                $question->section->survey_id,
                $question->id
            );
        }

        $question->update($data);

        return back();
    }

    /**
     * Bulk-update display_order of all questions in a section atomically.
     * Req 3.3
     *
     * Expects: { questions: [ { id: int, display_order: int }, ... ] }
     */
    public function reorder(Request $request, Section $section)
    {
        $this->authorize('update', $section->survey);

        $request->validate([
            'questions'                  => ['required', 'array'],
            'questions.*.id'             => ['required', 'integer', 'exists:questions,id'],
            'questions.*.display_order'  => ['required', 'integer', 'min:1'],
        ]);

        DB::transaction(function () use ($request, $section) {
            foreach ($request->questions as $item) {
                $section->questions()
                    ->where('id', $item['id'])
                    ->update(['display_order' => $item['display_order']]);
            }
        });

        return back();
    }

    /**
     * Move a question to a different section and resequence display_order
     * in both the source and destination sections.
     * Req 3.4
     *
     * Expects: { section_id: int }
     */
    public function move(Request $request, Question $question)
    {
        $this->authorize('update', $question->section->survey);

        $request->validate([
            'section_id' => ['required', 'integer', 'exists:sections,id'],
        ]);

        $sourceSection = $question->section;
        $targetSectionId = (int) $request->section_id;

        if ($sourceSection->id === $targetSectionId) {
            return back();
        }

        DB::transaction(function () use ($question, $sourceSection, $targetSectionId) {
            $removedOrder = $question->display_order;

            // Move question to destination section, appending at the end
            $nextOrder = Question::where('section_id', $targetSectionId)->max('display_order') + 1;

            $question->update([
                'section_id'    => $targetSectionId,
                'display_order' => $nextOrder,
            ]);

            // Resequence source section
            Question::where('section_id', $sourceSection->id)
                ->where('display_order', '>', $removedOrder)
                ->orderBy('display_order')
                ->get()
                ->each(function (Question $q, int $index) use ($removedOrder) {
                    $q->update(['display_order' => $removedOrder + $index]);
                });
        });

        return back();
    }

    /**
     * Delete a question and resequence remaining questions in the section.
     * Req 3.3
     */
    public function destroy(Question $question)
    {
        $this->authorize('update', $question->section->survey);

        // Structural lock: cannot delete questions once responses exist
        if ($question->section->survey->responses()->exists()) {
            return back()->withErrors([
                'question' => 'This question cannot be deleted because responses already exist for this survey.',
            ]);
        }

        $sectionId = $question->section_id;
        $deletedOrder = $question->display_order;

        DB::transaction(function () use ($question, $sectionId, $deletedOrder) {
            $question->delete();

            Question::where('section_id', $sectionId)
                ->where('display_order', '>', $deletedOrder)
                ->orderBy('display_order')
                ->get()
                ->each(function (Question $q, int $index) use ($deletedOrder) {
                    $q->update(['display_order' => $deletedOrder + $index]);
                });
        });

        return back();
    }

    /**
     * Generate a unique question_identifier slug scoped to the parent survey.
     * Appends a numeric suffix (-2, -3, ...) on collision.
     */
    private function generateUniqueSlug(string $label, int $surveyId, ?int $excludeQuestionId = null): string
    {
        $base = Str::slug($label);
        $slug = $base;
        $i = 2;

        while (
            Question::whereHas('section', fn ($q) => $q->where('survey_id', $surveyId))
                ->where('question_identifier', $slug)
                ->when($excludeQuestionId, fn ($q) => $q->where('id', '!=', $excludeQuestionId))
                ->exists()
        ) {
            $slug = $base . '-' . $i++;
        }

        return $slug;
    }
}
