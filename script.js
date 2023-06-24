// Get div with ID "root"
const root = document.getElementById('root')

const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			// Fade in joke, set class "show"
			entry.target.children[0].classList.toggle(
				'show',
				entry.isIntersecting
			)

			// Set animation delay for stars
			Object.values(entry.target.children).forEach((child) => {
				// Check that child is not the joke (check for stars)
				if (child !== entry.target.children[0]) {
					child.style.animationDelay = `${Math.floor(
						Math.random() * 6
					)}s`
				}
			})
		})
	},
	{ treshold: 1 }
)

// Check for last container and load new containers before the end is reached
const lastContainerObserver = new IntersectionObserver(
	(entries) => {
		const lastContainer = entries[0]
		if (!lastContainer.isIntersecting) return
		loadContainers()
		lastContainerObserver.unobserve(lastContainer.target)
	},
	{ rootMargin: '50px' }
)

function loadContainers() {
	// Set loading animation
	root.setAttribute('aria-busy', 'true')

	// Create 10 new containers
	for (let i = 0; i < 10; i++) {
		const div = document.createElement('div')
		div.classList.add('container')

		// Load joke and stars
		loadJoke(div)
		loadStars(div)

		// Observe when container scrolls into view
		observer.observe(div)
		root.append(div)
	}

	// Observe the last container, to load more (for infinite scrolling)
	lastContainerObserver.observe(
		document.querySelector('div.container:last-child')
	)

	// Stop loading animation
	root.removeAttribute('aria-busy')
}

function loadJoke(container) {
	// Create paragraph
	const p = document.createElement('p')

	// Fetch dad joke
	fetch('https://icanhazdadjoke.com/', {
		method: 'GET',
		headers: {
			Accept: 'application/json'
		}
	})
		.then((res) => res.json())
		.then((data) => {
			// Add dad joke to paragraph
			p.innerHTML = data.joke
		})

	// Append paragraph to container
	container.append(p)
}

function loadStars(container) {
	// Create 20 stars and add styles
	for (let i = 0; i < 20; i++) {
		const star = document.createElement('div')
		star.classList.add('star')
		// Add random position of the star in the container
		star.style.left = `${Math.floor(Math.random() * 100)}%`
		star.style.top = `${Math.floor(Math.random() * 100)}%`

		// Append stars to container
		container.append(star)
	}
}

// Set initial state
loadContainers()
const containers = document.querySelectorAll('div.container')
containers.forEach((container) => {
	observer.observe(container)
})
lastContainerObserver.observe(document.querySelector('.container:last-child'))
