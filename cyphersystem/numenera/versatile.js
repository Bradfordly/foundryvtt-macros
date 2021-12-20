// Ensure the selected token is bound to a valid Actor of type PC
if (!actor || actor.data.type != "PC")
  return ui.notifications.error("Please select a PC first");

// Get the value of the currentPool flag - set a value if null
let currentPool = actor.getFlag("cyphersystem", "currentPool");

if (currentPool == null)
  currentPool = "None";

// Render the popup to select the pool bonus to modify
let applyChanges = false;

new Dialog({
  title: `Versatile Pool Setting`,
  content: `
    <form>
      <div class="form-group">
        <label>Current Pool:</label>
        <p>${currentPool}</p>
      </div>
      <div class="form-group">
        <label>New Pool:</label>
        <select id="pool" name="pool">
          <option value="nochange">No Change</option>
          <option value="Might">Might</option>
          <option value="Speed">Speed</option>
          <option value="Intellect">Intellect</option>
        </select>
      </div>
    </form>
    `,
  buttons: {
    yes: {
      icon: "<i class='fas fa-check'></i>",
      label: `Apply Changes`,
      callback: () => applyChanges = true
    },
    no: {
      icon: "<i class='fas fa-times'></i>",
      label: `Cancel Changes`
    },
  },
  default: "yes",
  close: html => {
    if (applyChanges) {
      let targetPool = html.find('[name="pool"]')[0].value || "none";
      console.log("pool selected: "+targetPool)
      switch (targetPool) {
        case "Might":
          applyPoolBonus(targetPool, currentPool);
          break;
        case "Speed":
          applyPoolBonus(targetPool, currentPool);
          break;
        case "Intellect":
          applyPoolBonus(targetPool, currentPool);
          break;
        case "nochange":
          console.log("no change selected");
      }
    }
  }
}).render(true);

// Helper function for updates
function applyPoolBonus(targetPool, currentPool) {
    if (targetPool == currentPool) return ui.notifications.warn("You need to select a different Pool.")

    let targetPoolMax = "data.pools." + targetPool.toLowerCase() + ".max";
    let targetPoolValue = "data.pools." + targetPool.toLowerCase() + ".value";
    let currentPoolMax = "data.pools." + currentPool.toLowerCase() + ".max";
    let currentPoolValue = "data.pools." + currentPool.toLowerCase() + ".value";
    let newMaxTarget;
    let newMaxCurrent;
    let newValueTarget;
    let newValueCurrent;

    if (targetPool == "Might") {
        newMaxTarget = actor.data.data.pools.might.max + 2;
        newValueTarget = actor.data.data.pools.might.value + 2;
    } else if (targetPool == "Speed") {
        newMaxTarget = actor.data.data.pools.speed.max + 2;
        newValueTarget = actor.data.data.pools.speed.value + 2;
    } else if (targetPool == "Intellect") {
        newMaxTarget = actor.data.data.pools.intellect.max + 2;
        newValueTarget = actor.data.data.pools.intellect.value + 2;
    }

    if (currentPool == "Might") {
        newMaxCurrent = actor.data.data.pools.might.max - 2;
        newValueCurrent = actor.data.data.pools.might.value - 2;
    } else if (currentPool == "Speed") {
        newMaxCurrent = actor.data.data.pools.speed.max - 2;
        newValueCurrent = actor.data.data.pools.speed.value - 2;
    } else if (currentPool == "Intellect") {;
        newMaxCurrent = actor.data.data.pools.intellect.max - 2;
        newValueCurrent = actor.data.data.pools.intellect.value - 2;
    }

    if (currentPool != null) {
        actor.update({
            [targetPoolMax]: newMaxTarget,
            [targetPoolValue]: newValueTarget,
            [currentPoolMax]: newMaxCurrent,
            [currentPoolValue]: newValueCurrent
        });
        actor.setFlag("cyphersystem", "currentPool", targetPool);
    } else {
        actor.update({
            [targetPoolMax]: newMaxTarget,
            [targetPoolValue]: newValueTarget
        });
        actor.setFlag("cyphersystem", "currentPool", targetPool);
    }
}
