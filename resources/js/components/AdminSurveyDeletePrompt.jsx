export default function AdminSurveyDeletePrompt({
  onCancel,
  onConfirm,
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white w-[400px] rounded-xl p-6 shadow-xl">

        <h2 className="text-lg font-semibold mb-2">
          Are you sure?
        </h2>

        <p className="text-sm text-gray-500 mb-5">
          This will permanently delete this survey response.<br/>
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">

          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm border rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-md"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}