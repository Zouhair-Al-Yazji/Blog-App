'use strict';
const details = document.querySelectorAll('.details');
const togglePassword = document.querySelector('.togglePassword');
const toggleConfirmPassword = document.querySelector('.toggleConfirmPassword');
const form = document.querySelector('.form');
const username = document.querySelector('.username');
const email = document.querySelector('.email');
const password = document.querySelector('.password');
const confirmPassword = document.querySelector('.confirmPassword');
const commentForm = document.querySelector('.commentForm');

let usernameValue = '',
	emailValue = '';

function setErrorFor(input, message) {
	let formControl = input.parentElement.parentElement;
	const small = formControl.querySelector('small');
	formControl.classList.add('error');
	formControl.classList.remove('success');
	small.innerText = message;
}

function setSuccessFor(input) {
	let formControl = input.parentElement.parentElement;
	formControl.classList.remove('error');
	formControl.classList.add('success');
}

function cleanUp() {
	// remove the whitespace
	usernameValue = username.value.trim();
	emailValue = email.value.trim();
}

function validateInputs() {
	if (usernameValue === '') {
		setErrorFor(username, 'You must provide a username.');
	} else if (usernameValue !== '' && !validator.isAlphanumeric(usernameValue)) {
		setErrorFor(username, 'Username can only contain letters and numbers.');
	} else if (usernameValue.length > 0 && usernameValue.length < 3) {
		setErrorFor(username, 'Username must be at least 3 characters.');
	} else if (usernameValue.length > 30) {
		setErrorFor(username, 'Username cannot exceed 30 characters.');
	} else {
		setSuccessFor(username);
	}

	if (!validator.isEmail(emailValue)) {
		setErrorFor(email, 'You must provide a valid email.');
	} else {
		setSuccessFor(email);
	}

	if (password.value === '') {
		setErrorFor(password, 'You must provide a password.');
	} else if (password.value.length > 0 && password.value.length < 12) {
		setErrorFor(password, 'Password must be at least 12 characters.');
	} else if (password.value.length > 50) {
		setErrorFor(password, 'Password cannot exceed 50 characters.');
	} else {
		setSuccessFor(password);
	}

	if (confirmPassword.value === '') {
		setErrorFor(confirmPassword, 'You must provide a password.');
	} else if (password.value !== confirmPassword.value) {
		setErrorFor(confirmPassword, 'The password confirmation does not match.');
	} else {
		setSuccessFor(confirmPassword);
	}
}

if (form) {
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		cleanUp();
		validateInputs();
		let formControls = document.querySelectorAll('.form-container');
		let arrayForms = Array.from(formControls);
		let result = arrayForms.every((formControl) => {
			return formControl.classList.contains('success');
		});
		if (result) {
			form.submit();
		}
	});
}

if (commentForm) {
	commentForm.addEventListener('submit', (e) => {
		e.preventDefault();
	});
}

document.addEventListener('click', function (e) {
	// Close dropdown on click on the screen
	if (!e.target.classList.contains('list') && !e.target.classList.contains('summary')) {
		details.forEach((detail) => {
			if (detail.hasAttributes('open')) {
				detail.removeAttribute('open');
			}
		});
	}

	// show and hide password from input
	if (e.target.classList.contains('togglePassword')) {
		const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
		password.setAttribute('type', type);
		togglePassword.classList.toggle('ri-eye-line');
		togglePassword.classList.toggle('ri-eye-off-line');

		const titleMessage =
			togglePassword.getAttribute('title') === 'show password' ? 'hide password' : 'show password';
		togglePassword.setAttribute('title', titleMessage);
	}

	if (e.target.classList.contains('toggleConfirmPassword')) {
		const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
		confirmPassword.setAttribute('type', type);

		toggleConfirmPassword.classList.toggle('ri-eye-line');
		toggleConfirmPassword.classList.toggle('ri-eye-off-line');

		const titleMessage =
			toggleConfirmPassword.getAttribute('title') === 'show password'
				? 'hide password'
				: 'show password';
		toggleConfirmPassword.setAttribute('title', titleMessage);
	}
});

// Get references to the link and input element
const focusLink = document.getElementById('focusLink');
const inputToFocus = document.querySelector('.inputToFocus');

// Add a click event listener to the link
if (focusLink) {
	focusLink.addEventListener('click', function (event) {
		event.preventDefault(); // Prevent the link from navigating
		// Focus on the input element
		inputToFocus.focus();
	});
}
// Burger menus
document.addEventListener('DOMContentLoaded', function () {
	// open
	const burger = document.querySelectorAll('.navbar-burger');
	const menu = document.querySelectorAll('.navbar-menu');

	if (burger.length && menu.length) {
		for (var i = 0; i < burger.length; i++) {
			burger[i].addEventListener('click', function () {
				for (var j = 0; j < menu.length; j++) {
					menu[j].classList.toggle('hidden');
				}
			});
		}
	}
	// close
	const close = document.querySelectorAll('.navbar-close');
	const backdrop = document.querySelectorAll('.navbar-backdrop');

	if (close.length) {
		for (var i = 0; i < close.length; i++) {
			close[i].addEventListener('click', function () {
				for (var j = 0; j < menu.length; j++) {
					menu[j].classList.toggle('hidden');
				}
			});
		}
	}

	if (backdrop.length) {
		for (var i = 0; i < backdrop.length; i++) {
			backdrop[i].addEventListener('click', function () {
				for (var j = 0; j < menu.length; j++) {
					menu[j].classList.toggle('hidden');
				}
			});
		}
	}
});

let dropdown = document.getElementsByClassName('dropdown-btn');
let i;

for (i = 0; i < dropdown.length; i++) {
	dropdown[i].addEventListener('click', function () {
		this.firstElementChild.classList.toggle('ri-arrow-down-s-line');
		this.firstElementChild.classList.toggle('ri-arrow-up-s-line');

		let dropdownContent = this.parentElement.nextElementSibling.firstElementChild;
		dropdownContent.classList.toggle('bg-dark-hard');
		if (dropdownContent.classList.contains('block')) {
			dropdownContent.classList.toggle('block');
		} else {
			dropdownContent.classList.toggle('hidden');
		}
	});
}
const header = document.querySelector('.header');

let lastScrollTop = 0;

if (header) {
	window.addEventListener('scroll', () => {
		const currentScrollTop = window.scrollY || document.documentElement.scrollTop;

		if (currentScrollTop > lastScrollTop) {
			header.style.transform = 'translateY(-100px)';
		} else {
			header.style.transform = 'translateY(0)';
		}
		lastScrollTop = currentScrollTop;
		const scrollY = window.scrollY;
		if (scrollY > 50) {
			header.style.background = 'rgba(255, 255, 255, 0.9)';
			header.style.backdropFilter = 'blur(12px)';
		} else {
			header.style.background = 'none';
			header.style.backdropFilter = 'none';
		}
	});
}

const createPostForm = document.querySelector('.create-post-form');

if (createPostForm) {
	createPostForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const imgUrl = document.querySelector('.img-url');
		if (validator.isURL(imgUrl.value, { protocols: ['http', 'https'], require_tld: true })) {
			createPostForm.submit();
		} else {
			imgUrl.style.borderColor = `red`;
		}
	});
}
