import { downloadHashtagReport } from "../services/api"

export default function ReportPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">
        Reports
      </h1>

      <div className="bg-white/5 p-6 rounded-2xl">
        Report Management
      </div>

      <div className="bg-white/5 p-6 rounded-2xl">

        <button
          onClick={downloadHashtagReport}
          className="
            bg-green-600
            hover:bg-green-700
            px-6
            py-3
            rounded-xl
            font-semibold
          "
        >
          Download Today's Hashtag Report
        </button>

      </div>
    </div>
  )
}