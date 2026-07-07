import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />

      <div className="flex flex-col items-center justify-center flex-1 py-20 px-6 text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
        <p className="text-gray-500 text-lg max-w-md mb-4">
          Your job listing payment has been received. You can now post your job on PayClear.
        </p>
        <p className="text-gray-400 text-sm mb-10">
          You will receive a confirmation email shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="/post-job" className="bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-800">
            Post Your Job Now
          </a>
          <a href="/jobs" className="border border-gray-200 text-gray-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50">
            Browse Jobs
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}