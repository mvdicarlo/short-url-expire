<script>
  import { onMount } from 'svelte'

  import ShortenTime from './ShortenTime.svelte'
  import Countdown from './Countdown.svelte'

  let urlIsValid = false
  let isTouched = false
  let expires = null
  let creating = false
  let editMode = true
  let createdModel
  let generatedLink
  let error

  $: canSubmit = isTouched && urlIsValid
  $: submitting = creating
  $: showForm = editMode
  $: errorMsg = error

  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const err = urlParams.get('r')

    if (err) {
      error = err
    }
  })

  const validater = _.debounce(async e => {
    if (e.target.value && e.target.value.length >= 3) {
      const result = await axios.post('/validate', {
        url: e.target.value.trim()
      })

      urlIsValid = result.data.isValidUrl
    }
  }, 300)

  async function handleSubmit(e) {
    e.preventDefault()
    error = ''
    if (urlIsValid && isTouched && !creating) {
      creating = true
      const data = new FormData(e.target)

      try {
        const result = await axios.post('/create', {
          url: data.get('url').trim(),
          password: data.get('password').trim(),
          expires: expires ? expires.valueOf() : null
        })

        editMode = false
        createdModel = result.data
        generatedLink = buildUrl(createdModel.id)
      } catch (err) {
        error = err.response.data.message || 'A problem occurred'
      } finally {
        creating = false
      }
    }
  }

  async function validateUrl(e) {
    isTouched = true
    if (!e.target.value) urlIsValid = false
    validater(e)
  }

  function updateExpire(event) {
    expires = event.detail.value
  }

  function buildUrl(id) {
    return `${location.protocol}//${location.hostname}${location.port ? `:${location.port}` : ''}/${id}`
  }

  function copy() {
    const el = document.getElementById('generatedUrl')
    el.select()
    el.select(0, 99999)
    document.execCommand('copy')
  }

  function clearAndShowForm(e) {
    creating = false
    expires = null
    isTouched = false
    urlIsValid = false
    editMode = true
    createdModel = null
  }
</script>

<style>
svg {
  width: 2em;
}
.path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 0;
}
.path.circle {
  -webkit-animation: dash 0.9s ease-in-out;
  animation: dash 0.9s ease-in-out;
}
.path.line {
  stroke-dashoffset: 1000;
  -webkit-animation: dash 0.9s 0.35s ease-in-out forwards;
  animation: dash 0.9s 0.35s ease-in-out forwards;
}
.path.check {
  stroke-dashoffset: -100;
  -webkit-animation: dash-check 0.9s 0.35s ease-in-out forwards;
  animation: dash-check 0.9s 0.35s ease-in-out forwards;
}
@-webkit-keyframes dash {
  0% {
    stroke-dashoffset: 1000;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
@keyframes dash {
  0% {
    stroke-dashoffset: 1000;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
@-webkit-keyframes dash-check {
  0% {
    stroke-dashoffset: -100;
  }
  100% {
    stroke-dashoffset: 900;
  }
}
@keyframes dash-check {
  0% {
    stroke-dashoffset: -100;
  }
  100% {
    stroke-dashoffset: 900;
  }
}

</style>

{#if errorMsg}
<div class="alert alert-warning" role="alert">
  {errorMsg}
</div>
{/if}

{#if showForm}
<form on:submit={handleSubmit}>
  <div class="form-group">
    <div class="input-group">
      <label class="sr-only" for="url">Link</label>
      <div class="input-group-prepend">
        <span class="input-group-text">
          {#if urlIsValid}
          <svg viewBox="0 0 130.2 130.2">
            <circle class="path circle" fill="none" stroke="#5cb85c" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
            <polyline class="path check" fill="none" stroke="#5cb85c" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
          </svg>
          {:else}
          <svg viewBox="0 0 130.2 130.2">
            <circle class="path circle" fill="none" stroke="#d9534f" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
            <line class="path line" fill="none" stroke="#d9534f" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3"/>
            <line class="path line" fill="none" stroke="#d9534f" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2"/>
          </svg>
          {/if}
        </span>
      </div>
      <input name="url" id="url" class="form-control form-control-lg" maxlength="2048" placeholder="Shorten your link" required on:input={validateUrl}>
      <div class="input-group-append">
        <button id="submitBtn" class="btn btn-primary" disabled={!canSubmit}>Shorten</button>
      </div>
    </div>
  </div>
  <ShortenTime on:expireChange={updateExpire}/>
  <div class="form-group">
    <div class="input-group">
      <span class="input-group-prepend">
        <span class="input-group-text">
          <i class="fa fa-key"></i>
        </span>
      </span>
      <input type="password" name="password" autocomplete="off" maxlength="32" class="form-control" placeholder="Expire password (optional)" aria-describedby="expirePasswordHelp">
    </div>
    <small id="expirePasswordHelp" class="text-right form-text text-info">A password you can use to automatically expire a link.</small>
  </div>
</form>
{:else}
<div class="form-group">
  <Countdown date={createdModel.expires}/>
  <div class="input-group">
    <input class="form-control form-control-lg" id="generatedUrl" bind:value={generatedLink} readonly>
    <div class="input-group-append">
      <button type="button" class="btn btn-success" on:click={copy}>Copy</button>
    </div>
  </div>
</div>
<div>
  <button type="button" class="btn btn-primary" on:click={clearAndShowForm}>Shorten Another Link</button>
</div>
{/if}
