<script>
  import Countdown from './Countdown.svelte'

  let info
  let errorMsg
  let loading = false

  async function handleSubmit(e) {
    e.preventDefault()
    errorMsg = ''
    info = null
    if (e.target.elements.url.value.trim()) {
      loading = true
      try {
        const result = await axios.get(`/info/${encodeURIComponent(e.target.elements.url.value.trim())}`)
        info = result.data
        jQuery('#infoModal').modal('show')
      } catch (err) {
        errorMsg = 'No record found'
      } finally {
        loading = false
      }
    }
  }
</script>

<form class="form-inline d-flex" on:submit={handleSubmit}>
  {#if errorMsg}
    <span class="text-warning mr-1">{errorMsg}</span>
  {/if}
  <input class="form-control mr-sm-2" style="flex:5" name="url" type="text" placeholder="Link stats" title="Display information about a particular shortened link.">
  <button class="btn btn-secondary my-2 my-sm-0" type="submit" disabled={loading}>Search</button>
</form>

<div class="modal fade" id="infoModal" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Info</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        {#if info}
        <div class="row">
          <div class="col-3">ID:</div>
          <div class="col-9">{info.id}</div>

          <div class="col-3">Views:</div>
          <div class="col-9">{info.viewed}</div>

          <div class="col-3">Redirect:</div>
          <div class="col-9">{info.url}</div>

          <div class="col"><Countdown date={info.expires}/></div>

        </div>
        {/if}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
