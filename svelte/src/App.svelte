<script>
	import Navbar from './Navbar.svelte'
	import ShortenerForm from './ShortenerForm.svelte'
</script>

<style>
	.main {
		display: flex;
  	flex-direction: column;
  	justify-content: center;
	}
</style>

<Navbar />

<main class="container main">
	<div class="jumbotron">
		<ShortenerForm/>
	</div>
</main>
