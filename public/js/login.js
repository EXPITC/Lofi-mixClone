const login = document.querySelector('.login')
const singup = document.querySelector('.singup2')
const iconlogin = document.querySelector('.icon-user-header')
const xbtn = document.querySelector('.x-button-login')
const xbtn2 = document.querySelector('.x-button-login2')
const xbtn3 = document.querySelector('.x-button-singup2')
const btnlogin = document.querySelector('.btnlogin')
const login2 = document.querySelector('.login2')
const btnsingup = document.querySelector('.btnsingup')
const btnsinguphere = document.querySelector ('.singup-here')
const btnloginhere = document.querySelector ('.login-here')

iconlogin.onclick = function() {
    console.log('pass')
    login.classList.toggle("active")
}
xbtn.onclick = function() {
    console.log('pass x')
    login.classList.toggle("active")
}
xbtn2.onclick = function() {
    console.log('pass x')
    login2.classList.toggle("active")
    login.classList.toggle("active")
}
xbtn3.onclick = function() {
    singup.classList.toggle("active")
    console.log('pass x')
    login.classList.toggle("active")
}
btnlogin.onclick = (()=> {
    login.classList.toggle("active")
    login2.classList.toggle("active")
    console.log('pass 3')
})
btnsingup.onclick = (()=> {
    login.classList.toggle("active")
    singup.classList.toggle("active")
    console.log('pass 4')
})
btnsinguphere.onclick = (()=> {
    singup.classList.toggle("active")
    login2.classList.toggle("active")
    console.log('pass 5')
})
btnloginhere.onclick = (() => {
    login2.classList.toggle("active")
    singup.classList.toggle("active")
})