<script>
	import Search from './Search.svelte'
	import ShortenerForm from './ShortenerForm.svelte'

	let expireError
	let expireSuccess
	let expireWait = false

	async function expireId(e) {
		e.preventDefault()
		const data = {
			id: e.target.elements.id.value,
			password: e.target.elements.pw.value
		}

		if (data.id && data.password) {
			expireWait = true
			expireError = ''
			expireSuccess = ''
			try {
				await axios.post('/expire', data)
				expireSuccess = 'Link expired!'
			} catch (err) {
				expireError = err.response.data.message || 'A problem occurred'
			} finally {
				expireWait = false
			}
		}
	}
</script>

<style>
	.main {
		display: flex;
  	flex-direction: column;
  	justify-content: center;
	}
</style>

<header class="navbar navbar-expand-lg navbar-dark bg-dark">
	<a class="navbar-brand" href="#">Link Shortener</a>
	<div class="collapse navbar-collapse">
		<ul class="navbar-nav mr-auto">
			<li class="nav-item">
				<a href="/" class="nav-link"data-toggle="modal" data-target="#expireModal">Expire a Link</a>
			</li>
		</ul>
		<Search/>
	</div>
</header>

<main class="container main">
	<div class="jumbotron">
		<ShortenerForm/>
	</div>
</main>

<!-- Modals -->
<div>
	<div class="modal fade" id="expireModal" tabindex="-1" role="dialog" aria-labelledby="expireModalBtn" aria-hidden="true">
	  <div class="modal-dialog" role="document">
	    <div class="modal-content">
				<form on:submit={expireId}>
		      <div class="modal-header">
		        <h5 class="modal-title" id="exampleModalLabel">Expire Link</h5>
		        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
		          <span aria-hidden="true">&times;</span>
		        </button>
		      </div>
		      <div class="modal-body">
						{#if expireError}
							<div class="alert alert-warning">
								{expireError}
							</div>
						{/if}
						{#if expireSuccess}
							<div class="alert alert-success">
								{expireSuccess}
							</div>
						{/if}
						<div class="form-group">
							<input class="form-control" name="id" maxlength="120" placeholder="Link or Id" requred>
						</div>
						<div class="form-group">
							<input type="password" class="form-control" autocomplete="off" name="pw" maxlength="32" placeholder="Password" requred>
						</div>
		      </div>
		      <div class="modal-footer">
		        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
		        <button type="submit" class="btn btn-primary" disabled={expireWait}>Expire</button>
		      </div>
				</form>
	    </div>
	  </div>
	</div>
</div>
