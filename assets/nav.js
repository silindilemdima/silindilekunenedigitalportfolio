// assets/nav.js - injects a mobile hamburger and menu on pages that have a desktop nav
(function(){
  function $(s, root=document){return root.querySelector(s)}
  function $all(s, root=document){return Array.from(root.querySelectorAll(s))}

  // Add stylesheet if not present
  function ensureCSS(){
    if(document.querySelector('link[href="/assets/nav.css"], link[href="assets/nav.css"]')) return
    var l = document.createElement('link')
    l.rel = 'stylesheet'
    l.href = '/assets/nav.css'
    document.head.appendChild(l)
  }

  function buildMobileMenu(links){
    var menu = document.createElement('nav')
    menu.id = 'mobile-menu'
    menu.className = 'mobile-menu'
    menu.setAttribute('aria-hidden','true')

    var inner = document.createElement('div')
    inner.className = 'menu-inner'

    var headerRow = document.createElement('div')
    headerRow.className = 'close-row'

    var title = document.createElement('div')
    title.className = 'mobile-title'
    title.textContent = document.title || ''

    var closeBtn = document.createElement('button')
    closeBtn.className = 'close-btn'
    closeBtn.type = 'button'
    closeBtn.innerText = 'Close'
    closeBtn.addEventListener('click', function(){ toggle(false) })

    headerRow.appendChild(title)
    headerRow.appendChild(closeBtn)
    inner.appendChild(headerRow)

    var ul = document.createElement('ul')
    links.forEach(function(link){
      var li = document.createElement('li')
      var a = document.createElement('a')
      a.href = link.href
      a.textContent = link.textContent.trim() || link.getAttribute('aria-label') || link.href
      a.setAttribute('tabindex','0')
      li.appendChild(a)
      ul.appendChild(li)
    })
    inner.appendChild(ul)
    menu.appendChild(inner)
    document.body.appendChild(menu)
    return menu
  }

  function toggle(open){
    var isOpen = typeof open === 'boolean' ? open : !navToggle.getAttribute('aria-expanded') || navToggle.getAttribute('aria-expanded') === 'false' ? true : false
    navToggle.setAttribute('aria-expanded', String(isOpen))
    if(isOpen){
      mobileMenu.classList.add('open')
      mobileMenu.setAttribute('aria-hidden','false')
      document.body.style.overflow = 'hidden'
      // focus first link
      var f = mobileMenu.querySelector('a')
      if(f) f.focus()
    } else {
      mobileMenu.classList.remove('open')
      mobileMenu.setAttribute('aria-hidden','true')
      document.body.style.overflow = ''
      navToggle.focus()
    }
  }

  ensureCSS()

  // Wait for DOM
  document.addEventListener('DOMContentLoaded', function(){
    // find the primary nav links to reuse. Best-effort: look for <nav> with links, or header nav
    var sourceNav = document.querySelector('header nav') || document.querySelector('nav') || document.querySelector('ul')
    if(!sourceNav) return // nothing to copy

    // collect anchor elements
    var links = []
    if(sourceNav.tagName && sourceNav.tagName.toLowerCase() === 'ul'){
      links = sourceNav.querySelectorAll('a')
    } else {
      links = sourceNav.querySelectorAll('a')
    }
    links = Array.from(links).filter(function(a){ return a.href && a.getAttribute('href') && a.getAttribute('href') !== '#' })
    if(links.length === 0) return

    // create toggle button and insert before nav or at top of header
    var header = document.querySelector('header') || document.body
    navToggle = document.createElement('button')
    navToggle.id = 'nav-toggle'
    navToggle.className = 'nav-toggle'
    navToggle.setAttribute('aria-controls','mobile-menu')
    navToggle.setAttribute('aria-expanded','false')
    navToggle.setAttribute('aria-label','Toggle navigation')
    var span = document.createElement('span')
    span.className = 'hamburger'
    span.setAttribute('aria-hidden','true')
    navToggle.appendChild(span)

    // prefer inserting at the start of header
    if(header.firstChild) header.insertBefore(navToggle, header.firstChild)
    else header.appendChild(navToggle)

    // build mobile menu and wire up
    mobileMenu = buildMobileMenu(links)

    navToggle.addEventListener('click', function(e){
      e.stopPropagation()
      toggle()
    })

    // close on escape
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') toggle(false) })

    // click outside
    document.addEventListener('click', function(e){
      if(navToggle.getAttribute('aria-expanded') !== 'true') return
      if(!mobileMenu.contains(e.target) && e.target !== navToggle){
        toggle(false)
      }
    })
  })
})();
