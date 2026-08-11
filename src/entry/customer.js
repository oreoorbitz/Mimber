// customer — only on customers/* templates (login/signup/addr + reset msg). ~1.5K gzip
import { getHash, loginForms, resetPasswordSuccess } from '../utils.js'

if (typeof window !== 'undefined') {
  window.timber = window.timber || {}
  window.timber.getHash = getHash
  window.timber.loginForms = () => loginForms(window.timber)
  window.timber.resetPasswordSuccess = () => resetPasswordSuccess(window.timber)
  const initCustomer = () => {
    try {
      loginForms(window.timber)
    } catch {}
    try {
      resetPasswordSuccess(window.timber)
    } catch {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initCustomer)
  else queueMicrotask(initCustomer)
}
