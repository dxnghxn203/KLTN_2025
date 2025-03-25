export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="flex w-3/4 h-3/4 rounded-2xl shadow-lg overflow-hidden bg-white">
        {/* Left Section */}
        <div className="w-1/2 bg-blue-600 flex flex-col items-center justify-center text-white p-8">
          <h1 className="text-4xl font-bold">
            med<span className="text-yellow-400">explorer</span>
          </h1>
          <p className="mt-4 text-lg">
            Explore a world of medicine with ease and convenience.
          </p>
          <div className="mt-10">
            <img
              src="https://via.placeholder.com/300" // Thay thế bằng URL hình ảnh của bạn
              alt="Illustration"
              className="w-full"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="w-1/2 flex flex-col items-center justify-center p-12">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">Welcome!</h2>
          <form className="w-full max-w-sm">
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Your E-mail
              </label>
              <div className="relative mt-2">
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your e-mail"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  📧
                </span>
              </div>
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Your Password
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  🔒
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="form-checkbox text-blue-500 mr-2"
                />
                Remember my password
              </label>
              <a href="#" className="text-sm text-blue-500 hover:underline">
                Forgot your password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
