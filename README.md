# 🌍 Global AQI Predictor & Smog Simulator

An interactive, web-based atmospheric simulation engine and air quality predictor that goes beyond static reporting. It allows users to simulate environmental conditions, test "what-if" scenarios across multiple global cities, and visualize air pollution in real-time.

---

##  Real-World Application
Air pollution crises such as winter smog in New Delhi, Lahore, Beijing, and Ulaanbaatar are heavily influenced by a combination of meteorology (wind, temperature inversions, humidity) and human activity (biomass/stubble burning, vehicular traffic). 

This app serves as an **educational and analytical tool** for students, researchers, and citizens to understand *why* air pollution spikes, how meteorological factors trap particulate matter, and what health risks are associated with different pollutant levels.

---

##  How It Differs From Standard Weather Apps

| Feature | Standard Weather Apps | Global AQI Predictor & Smog Simulator |
| :--- | :--- | :--- |
| **Data Nature** | Passive (Displays current static numbers) | Active & Interactive (Allows slider-based "what-if" simulations) |
| **Scope** | Generic weather metrics | Specialized particulate modeling using official CPCB formulas |
| **Visualization** | Static icons or simple badges | Dynamic HTML5 Canvas rendering real-time fog, haze, and city landmark silhouettes |
| **Health Metrics** | Abstract qualitative terms ("Unhealthy") | Tangible metrics like daily cigarette smoking equivalence |

---

##  Key Features & Breakdown

* **Global City Selector:** 
  * Instantly switch between major pollution-impacted cities (**New Delhi, Lahore, Beijing, Ulaanbaatar, Los Angeles, and London**).
  * Automatically updates geographic coordinates and fetches live baseline particulate data ($\text{PM}_{2.5}$) via the **Open-Meteo Air Quality API**.
* **Interactive Simulation Sliders:**
  * **Wind Speed:** Simulates atmospheric dispersion (higher wind clears out particulate matter).
  * **Temperature:** Models winter thermal inversion effects where cold air traps pollutants near the surface.
  * **Humidity:** Simulates moisture accumulation forming thick smog and fog layers.
  * **Biomass / Stubble Fire Count:** Simulates regional agricultural burning impacts.
  * **Traffic & Emission Density:** Adjusts urban vehicular exhaust contribution.
* **Official Indian CPCB Math Engine:**
  * Implements linear interpolation sub-index formulas to convert raw $\mu g/m^3$ values of $\text{PM}_{2.5}$ into official Air Quality Index ratings paired with dynamic color-coded severity badges.
* **Health Impact & Cigarette Equivalent Calculator:**
  * Translates abstract particulate densities into a tangible health metric: daily cigarette exposure equivalence ($\sim 22\ \mu\text{g/m}^3\text{ PM}_{2.5} \approx 1\text{ cigarette}$ per day).
  * Generates real-time safety recommendations regarding N95 mask usage and air purifier deployment.
* **Dynamic HTML5 Canvas Landmark Engine:**
  * Renders custom city landmark silhouettes (**India Gate, Badshahi Mosque, Big Ben, etc.**) against a dynamic sky gradient.
  * Overlays a real-time particle and fog haze engine whose opacity and drift adjust instantly based on calculated AQI levels.

---
