( function () {
	const targets = document.querySelectorAll( '.has-scroll-shadow' );
	if ( ! targets.length ) return;

	function handleScroll() {
		const isScrolled = window.scrollY > 0;
		targets.forEach( ( el ) => el.classList.toggle( 'scrolled', isScrolled ) );
	}

	window.addEventListener( 'scroll', handleScroll, { passive: true } );
	handleScroll();
} )();
