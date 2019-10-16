<script>
  import { onMount, createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher();

  onMount(async () => {
    flatpickr(document.getElementById('time'), {
      enableTime: true,
      minuteIncrement: 1,
      minDate: new Date(),
      defaultDate: new Date().fp_incr(30),
      maxDate: new Date().fp_incr(60),
      onChange: emit
    })
  })

  function emit(selectedDates, dateStr, instance) {
    dispatch('expireChange', {
      value: selectedDates[0]
    })
  }
</script>

<div class="form-group">
  <div class="input-group">
    <span class="input-group-prepend">
      <span class="input-group-text"><i class="fa fa-calendar"></i></span>
    </span>
    <input type="text" id="time" class="form-control" placeholder="Link Expiration (defaults to 30 days)">
  </div>
</div>
