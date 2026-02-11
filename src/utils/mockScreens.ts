export function generateMockHtml(name: string, description: string): string {
  const normalizedName = name.toLowerCase().trim();
  
  let bodyContent = '';

  if (normalizedName.includes('login') || normalizedName.includes('sign in')) {
    bodyContent = getLoginTemplate(name, description);
  } else if (normalizedName.includes('dashboard')) {
    bodyContent = getDashboardTemplate(name, description);
  } else if (normalizedName.includes('profile')) {
    bodyContent = getProfileTemplate(name, description);
  } else if (normalizedName.includes('settings')) {
    bodyContent = getSettingsTemplate(name, description);
  } else if (normalizedName.includes('home') || normalizedName.includes('landing')) {
    bodyContent = getHomeTemplate(name, description);
  } else {
    bodyContent = getGenericTemplate(name, description);
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: '#3b82f6',
              secondary: '#64748b',
            }
          }
        }
      }
    </script>
</head>
<body class="bg-gray-50 min-h-screen font-sans text-gray-900">
    ${bodyContent}
</body>
</html>`;
}

function getLoginTemplate(name: string, description: string): string {
  return `
    <div class="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">${name}</h2>
          <p class="mt-2 text-center text-sm text-gray-600">${description || 'Sign in to your account'}</p>
        </div>
        <form class="mt-8 space-y-6" action="#" method="POST">
          <input type="hidden" name="remember" value="true">
          <div class="-space-y-px rounded-md shadow-sm">
            <div>
              <label for="email-address" class="sr-only">Email address</label>
              <input id="email-address" name="email" type="email" autocomplete="email" required class="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 pl-3" placeholder="Email address">
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input id="password" name="password" type="password" autocomplete="current-password" required class="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 pl-3" placeholder="Password">
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary">
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me</label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-primary hover:text-blue-500">Forgot your password?</a>
            </div>
          </div>

          <div>
            <button type="submit" class="group relative flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function getDashboardTemplate(name: string, description: string): string {
  return `
    <div class="min-h-screen bg-gray-100">
      <nav class="bg-white shadow-sm">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex h-16 justify-between">
            <div class="flex">
              <div class="flex flex-shrink-0 items-center">
                <span class="text-xl font-bold text-primary">AppLogo</span>
              </div>
              <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a href="#" class="inline-flex items-center border-b-2 border-primary px-1 pt-1 text-sm font-medium text-gray-900">Dashboard</a>
                <a href="#" class="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">Team</a>
                <a href="#" class="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">Projects</a>
              </div>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:items-center">
              <button type="button" class="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                <span class="sr-only">View notifications</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div class="py-10">
        <header>
          <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900">${name}</h1>
            <p class="mt-2 text-sm text-gray-600">${description}</p>
          </div>
        </header>
        <main>
          <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <!-- Card 1 -->
              <div class="overflow-hidden rounded-lg bg-white shadow">
                <div class="p-5">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                    <div class="ml-5 w-0 flex-1">
                      <dl>
                        <dt class="truncate text-sm font-medium text-gray-500">Total Users</dt>
                        <dd>
                          <div class="text-lg font-medium text-gray-900">71,897</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Card 2 -->
              <div class="overflow-hidden rounded-lg bg-white shadow">
                <div class="p-5">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <div class="ml-5 w-0 flex-1">
                      <dl>
                        <dt class="truncate text-sm font-medium text-gray-500">Avg. Open Rate</dt>
                        <dd>
                          <div class="text-lg font-medium text-gray-900">58.16%</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Card 3 -->
              <div class="overflow-hidden rounded-lg bg-white shadow">
                <div class="p-5">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
                      </svg>
                    </div>
                    <div class="ml-5 w-0 flex-1">
                      <dl>
                        <dt class="truncate text-sm font-medium text-gray-500">Avg. Click Rate</dt>
                        <dd>
                          <div class="text-lg font-medium text-gray-900">24.57%</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-8 rounded-lg bg-white shadow">
                <div class="px-4 py-5 sm:p-6">
                    <h3 class="text-base font-semibold leading-6 text-gray-900">Recent Activity</h3>
                    <div class="mt-4 border-t border-gray-100">
                        <ul role="list" class="divide-y divide-gray-100">
                            <li class="flex gap-x-4 py-5">
                                <div class="min-w-0">
                                    <p class="text-sm font-semibold leading-6 text-gray-900">Payment received</p>
                                    <p class="mt-1 truncate text-xs leading-5 text-gray-500">From stripe via bank transfer</p>
                                </div>
                            </li>
                            <li class="flex gap-x-4 py-5">
                                <div class="min-w-0">
                                    <p class="text-sm font-semibold leading-6 text-gray-900">New user registered</p>
                                    <p class="mt-1 truncate text-xs leading-5 text-gray-500">user@example.com</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `;
}

function getProfileTemplate(name: string, description: string): string {
  return `
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <div class="overflow-hidden rounded-lg bg-white shadow">
        <div class="h-32 bg-gradient-to-r from-blue-400 to-purple-500"></div>
        <div class="px-4 pb-5 sm:px-6">
          <div class="-mt-12 flex items-end">
            <div class="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-gray-200">
                <svg class="h-full w-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            </div>
            <div class="ml-4 flex-1">
              <h1 class="truncate text-2xl font-bold text-gray-900">${name}</h1>
              <p class="text-sm font-medium text-gray-500">Product Designer</p>
            </div>
            <div class="hidden sm:block">
                <button type="button" class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Edit Profile</button>
            </div>
          </div>
        </div>
        
        <div class="border-t border-gray-100 bg-gray-50 px-4 py-5 sm:px-6">
             <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Email address</dt>
                  <dd class="mt-1 text-sm text-gray-900">jane.doe@example.com</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Phone</dt>
                  <dd class="mt-1 text-sm text-gray-900">+1 555-0123</dd>
                </div>
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500">About</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    ${description || 'Passionate about building accessible and inclusive user experiences.'}
                  </dd>
                </div>
              </dl>
        </div>
      </div>
      
      <div class="mt-8">
        <h3 class="text-lg font-medium leading-6 text-gray-900">Settings</h3>
        <div class="mt-4 overflow-hidden rounded-lg bg-white shadow">
            <ul role="list" class="divide-y divide-gray-200">
                <li class="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer">
                    <div class="flex items-center justify-between">
                        <p class="truncate text-sm font-medium text-primary">Account Preferences</p>
                        <div class="ml-2 flex flex-shrink-0">
                            <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" /></svg>
                        </div>
                    </div>
                </li>
                 <li class="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer">
                    <div class="flex items-center justify-between">
                        <p class="truncate text-sm font-medium text-primary">Security</p>
                        <div class="ml-2 flex flex-shrink-0">
                             <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" /></svg>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
      </div>
    </div>
  `;
}

function getSettingsTemplate(name: string, description: string): string {
  return `
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-base font-semibold leading-6 text-gray-900">Profile</h3>
            <p class="mt-1 text-sm text-gray-600">This information will be displayed publicly so be careful what you share.</p>
          </div>
        </div>
        <div class="mt-5 md:col-span-2 md:mt-0">
          <form action="#" method="POST">
            <div class="shadow sm:overflow-hidden sm:rounded-md">
              <div class="space-y-6 bg-white px-4 py-5 sm:p-6">
                <div>
                    <h2 class="text-xl font-bold mb-4">${name}</h2>
                    <p class="text-gray-500 mb-6">${description}</p>
                </div>
                <div class="grid grid-cols-3 gap-6">
                  <div class="col-span-3 sm:col-span-2">
                    <label for="company-website" class="block text-sm font-medium leading-6 text-gray-900">Website</label>
                    <div class="mt-2 flex rounded-md shadow-sm">
                      <span class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm">http://</span>
                      <input type="text" name="company-website" id="company-website" class="block w-full flex-1 rounded-none rounded-r-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" placeholder="www.example.com">
                    </div>
                  </div>
                </div>

                <div>
                  <label for="about" class="block text-sm font-medium leading-6 text-gray-900">About</label>
                  <div class="mt-2">
                    <textarea id="about" name="about" rows="3" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"></textarea>
                  </div>
                  <p class="mt-2 text-sm text-gray-500">Brief description for your profile. URLs are hyperlinked.</p>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button type="submit" class="inline-flex justify-center rounded-md bg-primary py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Save</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
       <div class="hidden sm:block" aria-hidden="true">
        <div class="py-5">
          <div class="border-t border-gray-200"></div>
        </div>
      </div>

      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-base font-semibold leading-6 text-gray-900">Notifications</h3>
            <p class="mt-1 text-sm text-gray-600">Decide which communications you'd like to receive and how.</p>
          </div>
        </div>
        <div class="mt-5 md:col-span-2 md:mt-0">
          <form action="#" method="POST">
            <div class="shadow sm:overflow-hidden sm:rounded-md">
              <div class="space-y-6 bg-white px-4 py-5 sm:p-6">
                <fieldset>
                  <legend class="sr-only">By Email</legend>
                  <div class="text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">By Email</div>
                  <div class="mt-4 space-y-4">
                    <div class="flex items-start">
                      <div class="flex h-6 items-center">
                        <input id="comments" name="comments" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary">
                      </div>
                      <div class="ml-3 text-sm leading-6">
                        <label for="comments" class="font-medium text-gray-900">Comments</label>
                        <p class="text-gray-500">Get notified when someones posts a comment on a posting.</p>
                      </div>
                    </div>
                    <div class="flex items-start">
                      <div class="flex h-6 items-center">
                        <input id="candidates" name="candidates" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary">
                      </div>
                      <div class="ml-3 text-sm leading-6">
                        <label for="candidates" class="font-medium text-gray-900">Candidates</label>
                        <p class="text-gray-500">Get notified when a candidate applies for a job.</p>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button type="submit" class="inline-flex justify-center rounded-md bg-primary py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Save</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
}

function getHomeTemplate(name: string, description: string): string {
  return `
    <div class="bg-white">
      <header class="absolute inset-x-0 top-0 z-50">
        <nav class="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div class="flex lg:flex-1">
            <a href="#" class="-m-1.5 p-1.5">
              <span class="sr-only">Your Company</span>
              <span class="text-xl font-bold text-primary">Brand</span>
            </a>
          </div>
          <div class="hidden lg:flex lg:gap-x-12">
            <a href="#" class="text-sm font-semibold leading-6 text-gray-900">Product</a>
            <a href="#" class="text-sm font-semibold leading-6 text-gray-900">Features</a>
            <a href="#" class="text-sm font-semibold leading-6 text-gray-900">Marketplace</a>
            <a href="#" class="text-sm font-semibold leading-6 text-gray-900">Company</a>
          </div>
          <div class="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="#" class="text-sm font-semibold leading-6 text-gray-900">Log in <span aria-hidden="true">&rarr;</span></a>
          </div>
        </nav>
      </header>

      <div class="relative isolate px-6 pt-14 lg:px-8">
        <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div class="text-center">
            <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">${name}</h1>
            <p class="mt-6 text-lg leading-8 text-gray-600">${description || 'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua.'}</p>
            <div class="mt-10 flex items-center justify-center gap-x-6">
              <a href="#" class="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Get started</a>
              <a href="#" class="text-sm font-semibold leading-6 text-gray-900">Learn more <span aria-hidden="true">→</span></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getGenericTemplate(name: string, description: string): string {
  return `
    <div class="min-h-screen flex items-center justify-center p-8 bg-gray-50">
      <div class="max-w-2xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="bg-primary px-6 py-4">
          <h2 class="text-2xl font-bold text-white">${name}</h2>
        </div>
        <div class="p-6">
          <div class="prose max-w-none">
             <p class="text-gray-700 text-lg mb-6">${description || 'Content placeholder for this screen.'}</p>
          </div>
          
          <div class="grid grid-cols-2 gap-4 mt-8">
             <div class="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
             <div class="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
             <div class="h-32 bg-gray-100 rounded-lg animate-pulse col-span-2"></div>
          </div>
          
           <div class="mt-8 flex justify-end">
             <button class="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-md shadow-sm mr-2">
               Cancel
             </button>
             <button class="bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow-sm">
               Confirm
             </button>
           </div>
        </div>
      </div>
    </div>
  `;
}
