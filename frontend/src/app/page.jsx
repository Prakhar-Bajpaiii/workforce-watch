import React from 'react'

const Home = () => {
  return (
    <div>
      <>
  <meta charSet="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>Freebie 44 - Marketing Web App (Tailwind CSS) by pixelcave</title>
  <meta
    name="description"
    content="Freebie 44 - Marketing Web App (Tailwind CSS). Check out more at https://pixelcave.com"
  />
  <meta name="author" content="pixelcave" />
  {/* Icons */}
  <link
    rel="icon"
    href="https://cdn.pixelcave.com/favicon.svg"
    sizes="any"
    type="image/svg+xml"
  />
  <link
    rel="icon"
    href="https://cdn.pixelcave.com/favicon.png"
    type="image/png"
  />
  {/* Inter web font from bunny.net (GDPR compliant) */}
  <link rel="preconnect" href="https://fonts.bunny.net" />
  <link
    href="https://fonts.bunny.net/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
    rel="stylesheet"
  />
  {/* Tailwind CSS Play CDN (mostly for development/testing purposes) */}
  {/* Tailwind CSS v4 Configuration */}
  <style
    type="text/tailwindcss"
    dangerouslySetInnerHTML={{
      __html:
        '\n      /* Class based dark mode */\n      @custom-variant dark (&:where(.dark, .dark *));\n\n      /* Theme configuration */\n      @theme {\n        /* Fonts */\n        --default-font-family: "Inter";\n      }\n    '
    }}
  />
  {/* Page Container */}
  <div
    id="page-container"
    className="mx-auto flex min-h-dvh w-full min-w-[320px] flex-col bg-gray-100"
  >
    {/* Page Content */}
    <main id="page-content" className="flex max-w-full flex-auto flex-col">
      {/* Hero */}
      <div className="bg-gray-900">
        {/* Header */}
        <header id="page-header" className="flex flex-none items-center py-10">
          <div className="container mx-auto flex flex-col gap-6 px-4 text-center sm:flex-row sm:items-center sm:justify-between sm:gap-0 lg:px-8 xl:max-w-6xl">
            <div>
              <a
                href="javascript:void(0)"
                className="inline-flex items-center gap-2 text-lg font-bold tracking-wide text-white hover:opacity-75"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  data-slot="icon"
                  className="hi-mini hi-link inline-block size-5 opacity-50"
                >
                  <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
                  <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
                </svg>
                <span>WORKFORCE WATCH</span>
              </a>
            </div>
            <nav className="flex items-center justify-center gap-4 text-sm sm:gap-6">
              <a
                href="javascript:void(0)"
                className="font-semibold text-gray-400 hover:text-white"
              >
                <span>Features</span>
              </a>
              <a
                href="javascript:void(0)"
                className="font-semibold text-gray-400 hover:text-white"
              >
                <span>Pricing</span>
              </a>
              <a
                href="javascript:void(0)"
                className="font-semibold text-gray-400 hover:text-white"
              >
                <span>Contact</span>
              </a>
              <a
                href="/user-login"
                className="inline-flex items-center gap-2 font-semibold text-gray-400 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  data-slot="icon"
                  className="hi-mini hi-user-circle inline-block size-5 opacity-50"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Sign In</span>
              </a>
            </nav>
          </div>
        </header>
        {/* END Header */}
        {/* Hero Content */}
        <div className="container mx-auto px-4 pt-16 lg:px-8 lg:pt-32 xl:max-w-6xl">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-extrabold text-balance text-white md:text-5xl">
              Workforce Watch for viewing work from home Employees
            </h2>
            <h3 className="mx-auto text-lg font-medium text-gray-400 md:text-xl md:leading-relaxed lg:w-2/3">
              You can see the work done by employees in real time. You can also see the work done by
             employees in the past and also give new task to employees
            </h3>
          </div>
          <div className="flex flex-wrap justify-center gap-4 pt-10 pb-16">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-800 bg-blue-800 px-6 py-4 leading-6 font-semibold text-white hover:border-blue-700/50 hover:bg-blue-700/50 hover:text-white focus:ring-3 focus:ring-blue-500/50 focus:outline-hidden active:border-blue-700 active:bg-blue-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                data-slot="icon"
                className="hi-mini hi-arrow-right inline-block size-5 opacity-50"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Get Started</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-800 bg-gray-800 px-6 py-4 leading-6 font-semibold text-white hover:border-gray-700/50 hover:bg-gray-700/50 hover:text-white focus:ring-3 focus:ring-gray-500/25 focus:outline-hidden active:border-gray-700 active:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                data-slot="icon"
                className="hi-mini hi-eye inline-block size-5 opacity-50"
              >
                <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                <path
                  fillRule="evenodd"
                  d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Live Demo</span>
            </button>
          </div>
          <div className="relative mx-5 -mb-20 rounded-xl bg-white p-2 shadow-lg sm:-mb-40 lg:mx-32">
            <img
              src="https://img.freepik.com/free-photo/side-view-man-having-online-video-call-with-coworkers_23-2148908840.jpg?semt=ais_hybrid&w=740"
              alt="Hero Image"
              className="mx-auto aspect-3/2 w-full rounded-lg object-cover"
            />
          </div>
        </div>
        {/* END Hero Content */}
      </div>
      {/* END Hero */}
      {/* Features Section */}
      <div className="bg-white pt-40">
        <div className="container mx-auto space-y-16 px-4 py-16 lg:px-8 lg:py-32 xl:max-w-6xl">
          {/* Heading */}
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-extrabold md:text-4xl">
              Powerful Tools
            </h2>
            <h3 className="mx-auto text-lg font-medium text-gray-600 md:text-xl md:leading-relaxed lg:w-2/3">
              We built the best tools to elevate your marketing efforts.
            </h3>
          </div>
          {/* END Heading */}
          {/* Features */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-12">
            <div className="py-5 text-center">
              <div className="relative mb-12 ml-3 inline-flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 -m-3 translate-x-1 translate-y-1 rounded-full bg-blue-300" />
                <div className="absolute inset-0 -m-3 rounded-full bg-blue-600/75" />
                <svg
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="hi-outline hi-code relative inline-block h-10 w-10 text-white opacity-90 transition duration-150 ease-out group-hover:scale-125 group-hover:opacity-100"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <h4 className="mb-2 text-xl font-bold">Automation</h4>
              <p className="text-left leading-relaxed text-gray-600">
                Vestibulum ullamcorper, odio sed rhoncus imperdiet, enim elit
                sollicitudin orci, eget dictum leo mi nec lectus. Nam commodo
                turpis id lectus scelerisque vulputate.
              </p>
            </div>
            <div className="py-5 text-center">
              <div className="relative mb-12 ml-3 inline-flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 -m-3 translate-x-1 translate-y-1 rounded-full bg-blue-300" />
                <div className="absolute inset-0 -m-3 rounded-full bg-blue-600/75" />
                <svg
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="hi-outline hi-device-mobile relative inline-block h-10 w-10 text-white opacity-90 transition duration-150 ease-out group-hover:scale-125 group-hover:opacity-100"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h4 className="mb-2 text-xl font-bold">Schedule</h4>
              <p className="text-left leading-relaxed text-gray-600">
                Vestibulum ullamcorper, odio sed rhoncus imperdiet, enim elit
                sollicitudin orci, eget dictum leo mi nec lectus. Nam commodo
                turpis id lectus scelerisque vulputate.
              </p>
            </div>
            <div className="py-5 text-center">
              <div className="relative mb-12 ml-3 inline-flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 -m-3 translate-x-1 translate-y-1 rounded-full bg-blue-300" />
                <div className="absolute inset-0 -m-3 rounded-full bg-blue-600/75" />
                <span className="relative text-xl font-semibold text-white opacity-90 transition duration-150 ease-out group-hover:scale-125 group-hover:opacity-100">
                  JS
                </span>
              </div>
              <h4 className="mb-2 text-xl font-bold">Integrations</h4>
              <p className="text-left leading-relaxed text-gray-600">
                Vestibulum ullamcorper, odio sed rhoncus imperdiet, enim elit
                sollicitudin orci, eget dictum leo mi nec lectus. Nam commodo
                turpis id lectus scelerisque vulputate.
              </p>
            </div>
          </div>
          {/* END Features */}
        </div>
      </div>
      {/* END Features Section */}
      {/* How it works */}
      <div className="relative bg-white">
        <div className="absolute inset-0 skew-y-1 bg-blue-900" />
        <div className="relative container mx-auto space-y-16 px-4 py-16 lg:px-8 lg:py-32 xl:max-w-7xl">
          {/* Heading */}
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white md:text-4xl">
              How it works?
            </h2>
          </div>
          {/* END Heading */}
          {/* Steps */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            <div className="rounded-3xl bg-white/5 p-10 shadow-xs transition hover:bg-white/10">
              <svg
                className="hi-solid hi-desktop-computer mb-5 inline-block h-12 w-12 text-blue-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
                  clipRule="evenodd"
                />
              </svg>
              <h4 className="mb-2 text-lg font-bold text-white">
                1. Manage Employee
              </h4>
              <p className="text-sm leading-relaxed text-white/75">
                Vestibulum ullamcorper, odio sed rhoncus imperdiet, enim elit
                sollicitudin orci, eget dictum leo mi nec lectus. Nam commodo
                turpis id lectus scelerisque vulputate.
              </p>
            </div>
            <div className="rounded-3xl bg-white/5 p-10 shadow-xs transition hover:bg-white/10">
              <svg
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="hi-outline hi-cube mb-5 inline-block h-12 w-12 text-blue-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <h4 className="mb-2 text-lg font-bold text-white">
                2. Add Employee
              </h4>
              <p className="text-sm leading-relaxed text-white/75">
                Vestibulum ullamcorper, odio sed rhoncus imperdiet, enim elit
                sollicitudin orci, eget dictum leo mi nec lectus. Nam commodo
                turpis id lectus scelerisque vulputate.
              </p>
            </div>
            <div className="rounded-3xl bg-white/5 p-10 shadow-xs transition hover:bg-white/10 sm:col-span-2 lg:col-span-1">
              <svg
                className="hi-solid hi-pencil mb-5 inline-block h-12 w-12 text-blue-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <h4 className="mb-2 text-lg font-bold text-white">
                3. Add task
              </h4>
              <p className="text-sm leading-relaxed text-white/75">
                Vestibulum ullamcorper, odio sed rhoncus imperdiet, enim elit
                sollicitudin orci, eget dictum leo mi nec lectus. Nam commodo
                turpis id lectus scelerisque vulputate.
              </p>
            </div>
          </div>
          {/* END Steps */}
        </div>
      </div>
      {/* How it works */}
      {/* Pricing Section */}
      <div className="bg-white">
        <div className="container mx-auto space-y-10 px-4 py-16 lg:px-8 lg:py-32 xl:max-w-4xl">
          {/* Heading */}
        
          {/* END Heading */}
          {/* Pricing Plans */}
         
          {/* END Pricing Plans */}
        </div>
      </div>
      {/* END Pricing Section */}
      {/* Stats Section */}
      <div className="bg-gray-900">
        <div className="container mx-auto px-4 lg:px-8 xl:max-w-7xl">
          <div className="grid grid-cols-1 divide-y divide-gray-800 text-center sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <dl className="space-y-1 px-5 py-16 lg:py-32">
              <dt className="text-4xl font-extrabold text-white">998k+</dt>
              <dd className="text-sm font-semibold tracking-wide text-blue-400 uppercase">
                Posts
              </dd>
            </dl>
            <dl className="space-y-1 px-5 py-16 lg:py-32">
              <dt className="text-4xl font-extrabold text-white">1,5k+</dt>
              <dd className="text-sm font-semibold tracking-wide text-blue-400 uppercase">
                Automations
              </dd>
            </dl>
            <dl className="space-y-1 px-5 py-16 lg:py-32">
              <dt className="text-4xl font-extrabold text-white">7,9k</dt>
              <dd className="text-sm font-semibold tracking-wide text-blue-400 uppercase">
                Dashboards
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {/* Stats Section */}
      {/* Footer */}
      <footer id="page-footer" className="bg-white">
        <div className="container mx-auto flex flex-col gap-6 px-4 py-16 text-center text-sm md:flex-row md:justify-between md:gap-0 md:text-left lg:px-8 lg:py-32 xl:max-w-6xl">
          <nav className="space-x-2 sm:space-x-4">
            <a
              href="javascript:void(0)"
              className="font-medium text-gray-700 hover:text-blue-500"
            >
              About
            </a>
            <a
              href="javascript:void(0)"
              className="font-medium text-gray-700 hover:text-blue-500"
            >
              Terms of Service
            </a>
            <a
              href="javascript:void(0)"
              className="font-medium text-gray-700 hover:text-blue-500"
            >
              Privacy Policy
            </a>
          </nav>
          <div className="text-gray-500">
            <span className="font-medium">Company</span> ©
          </div>
        </div>
      </footer>
      {/* END Footer */}
    </main>
    {/* END Page Content */}
  </div>
  {/* END Page Container */}
</>

    </div>
  )
}

export default Home