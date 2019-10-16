<script>
  import { onMount, onDestroy } from 'svelte'

  export let date

  let time = {}
  let expired = false
  let interval

  onMount(async () => {
    setInterval(update, 500)
  })

  onDestroy(() => clearInterval(interval))

  async function update() {
    if (isExpired()) {
      clearInterval(interval)
      expired = true
    } else {
      time = trimTimeObject(computeTime())
    }
  }

  function trimTimeObject(obj) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      if (!obj[keys[i]]) {
        delete obj[keys[i]]
      } else {
        break
      }
    }

    return obj
  }

  function isExpired() {
    if ((new Date(date).valueOf() - Date.now()) < 0) {
      return true
    }

    return false
  }

  function computeTime() {
    let d = Math.abs(new Date(date).valueOf() - Date.now()) / 1000
    let r = {}
    let s = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    }

    Object.keys(s).forEach(function(key){
        r[key] = Math.floor(d / s[key])
        d -= r[key] * s[key]
    })

    return r
  }

  function getName(entry) {
    if (entry[1] > 1) {
      return `${entry[0]}s`
    }

    return entry[0]
  }
</script>

<style>
  .time-box {
    display: inline-block;
    border-radius: 8px;
    border: 2px solid var(--primary);
    min-width: 5em;
  }

  .time-box div {
    text-align: center;
  }

  .time-box div:last-child {
    border-top: 1px solid var(--primary);
  }
</style>

<div class="text-center">
{#if expired}
  <div class="alert alert-warning">
    <strong>Link has expired!</strong>
  </div>
{:else}
  <div class="alert">
  {#each Object.entries(time) as entry}
    <div class="time-box mr-2">
      <div>{entry[1]}</div>
      <div class="text-capitalize">
        {getName(entry)}
      </div>
    </div>
  {/each}
  </div>
{/if}
</div>
