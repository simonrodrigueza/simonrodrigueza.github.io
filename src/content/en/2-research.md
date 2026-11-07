---
id: research
label: Research
title: Research
---

<!-- Each "###" line is a subtitle (a research topic or project).
     Add a new "###" block whenever you have something new to show. -->

### Beyond LTE: Evaluation of HCN and C₂H₂ as truncation tracers in highly irradiated protoplanetary disks

*Undergraduate thesis, XUE collaboration (JWST/MIRI). Advisor: Germán Chaparro. 2025–2026*

Most stars are born in dense clusters, where massive O- and B-type stars bathe their neighbours in intense ultraviolet radiation. This radiation can photoevaporate the outer regions of protoplanetary disks and truncate them, that is, reduce their size. My thesis is part of the XUE collaboration (eXtreme UV Environments), which uses the James Webb Space Telescope to study disks in NGC 6357, one of the most extreme star-forming regions in the Milky Way. I focus on XUE 1, a disk exposed to a radiation field roughly a hundred thousand times stronger than that of the local interstellar medium.

Previous work with thermochemical models proposed HCN and C₂H₂ as good tracers of truncation. Those models assumed local thermodynamic equilibrium (LTE), which is hard to justify in the gas-depleted outer regions where that signal originates. In this thesis I test whether these molecules remain good tracers once LTE is no longer assumed. To do so, I combine analytical statistical-equilibrium estimates, disk models computed with ProDiMo in a pseudo-non-LTE treatment, and detailed radiative transfer with FLiTs to produce synthetic spectra comparable to MIRI/JWST observations.

The results show that the emitting layers depart from LTE and that the radiative transfer method changes the conclusion. With a simplified estimator, HCN emission looks almost insensitive to truncation. With FLiTs, which includes dust absorption in the inner disk, HCN turns out to be a highly sensitive tracer of disk size.

### Mapping thermodynamic conditions for subsurface water stability on Mars

*Team project with Sebastián Numpaque, Brandon Montoya and David Pérez, in collaboration with Prof. Jorge Zuluaga (Institute of Physics, UdeA). Poster presented at the National Congress of Physics, Manizales, 2025.*

Radar observations and seismic data suggest that liquid water could exist beneath the surface of Mars. In this project we studied where on the planet, and at what depth, the Martian crust (0–45 km) would have pressure and temperature conditions compatible with liquid water.

We started from the density, pressure and temperature profiles derived from the SEIS seismometer on the InSight mission. With them we parametrized the temperature profile and solved the hydrostatic equilibrium equations in Python, using data from the Mars Climate Database as initial conditions. This gave us pressure and temperature profiles for every latitude and longitude, which we then compared with the phase diagram of pure water to find the depth at which ice would turn into liquid water.

The result is a global map of the depth of this transition, which ranges from 0 to 27 km depending on the region. The model shows that the stability of liquid water depends mainly on pressure and temperature. Salts, which we did not include in this first model, would lower the freezing point and bring the water closer to the surface. These results help assess the habitability of Mars and identify possible water reserves for future missions, and the method can be applied to other planetary bodies.
