---
{
  "format": 1,
  "metadata": {
    "id": "motulator-drive-grid-capability-map",
    "title": "motulator0.7.3 motor-drive and grid capability map",
    "question": "Which motor, control, solver and grid APIs exist, and what separates production use from unexercised capabilities?",
    "scope": "Historical installed-source map of induction/synchronous drives, grid converters, limits and logging; not a new simulation.",
    "summary": "Maps motor/control families and production-use boundaries, retaining limit-controller and solver checks as open.",
    "researched_at": null,
    "last_improved_at": null,
    "language": "en",
    "origin": {
      "kind": "imported",
      "platform": "unknown",
      "author": "unknown",
      "model": "unknown"
    },
    "related_reports": [],
    "warnings": [
      "Imported without fresh source or technical verification; historical findings are not current compliance, safety or legal certification.",
      "Original report bytes/citations are preserved. Third-party quotations, code and sources retain their own rights; unresolved local/transcript references remain unavailable.",
      "Preserve limitations and uncertainty; no technical verification/current-applicability claim.",
      "Two upstream project/docs URLs plus extensive local installed-source and production-code references.",
      "Absolute package path and internal production file/line mapping.",
      "Source-era module/HANDOFF context and linked dependencies unavailable/uninspected.",
      "Facts, execution/benchmark claims and legal assertions not independently checked."
    ],
    "superseded_by": null,
    "created_at": "2026-11-01T23:32:55.931Z",
    "updated_at": "2026-11-01T23:32:55.931Z",
    "imported_at": "2026-11-01T20:39:01.122Z"
  },
  "warnings": [
    {
      "code": "unknown_research_date",
      "message": "Original research date unknown; import is not verification."
    },
    {
      "code": "unknown_origin",
      "message": "Original platform or author unknown; review attribution."
    },
    {
      "code": "local_dependency",
      "message": "Local file reference may not be portable; review before publication."
    },
    {
      "code": "unresolved_citation",
      "message": "Unresolved or ambiguous imported reference or footnote; no target was invented."
    },
    {
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "14b3eafeb24540f7874fba955062ed2a02e8eb781d824078d1a8da3493b377fa",
  "proposalRevision": "9494abd126ef74199753307086174267a22be3ac5d30359bfaff46233d24c593"
}
---
# motulator 0.7.3 — API Capability Surface

Research note (Phase 1, capability coverage). Installed source is ground truth:
`/media/eldar/disk_2/Machine_concept/.venv/lib/python3.12/site-packages/motulator/`
(distspec: `motulator-0.7.3.dist-info/METADATA`, Version 0.7.3, MIT, `Requires-Python >=3.12`,
deps: matplotlib, numpy, scipy, tqdm).

Upstream (metadata `Project-URL`): GitHub `https://github.com/Aalto-Electric-Drives/motulator`
(NOT `aaltomotorsim/motulator`), docs `https://aalto-electric-drives.github.io/motulator/`
(NOT motulator.readthedocs.io). Tag `v0.7.3` exists upstream; newer v0.7.4 / v0.7.5 exist —
pin 0.7.3.

Tag legend: `[production-used]` = touched by `MECHANICS/selection/asinc_inv_simulation`
(simulate_motor.py + tests). Everything else `[capsule-only]` = not used by production today.

---

## 1. Package architecture

All files under `motulator/`. Each `_*.py` module is one source file; `__init__.py` re-exports
the public API.

### `motulator` (root)
- `__init__.py` — docstring only, no public symbols.

### `motulator.common` — shared infrastructure (models, controls, utils)
- `common/__init__.py` — "Common model package", no public symbols.
- `common/control/__init__.py` — exports `ComplexPIController, ControlSystem, PIController, PWM, RateLimiter, TimeSeries`.
- `common/control/_base.py` — `ControlSystem` (protocol + default run loop), `TimeSeries` (ctrl result container), `References` protocol.
- `common/control/_controllers.py` — `PIController` (2DOF discrete PI), `ComplexPIController` (synchronous-frame complex-vector PI), `RateLimiter`.
- `common/control/_pwm.py` — `PWM` (space-vector PWM, overmodulation MPE/MME/six_step, realized-voltage computation).
- `common/model/__init__.py` — exports `Model, ModelTimeSeries, Subsystem, SubsystemTimeSeries, CarrierComparison, Simulation, SimulationResults, SolverCfg`.
- `common/model/_base.py` — `Model` (continuous-time model base, subsystem interconnection), `Subsystem` protocol, `ModelTimeSeries`, `Delay` (ring-buffer computational delay), state/history dataclasses.
- `common/model/_converter.py` — `VoltageSourceConverter`, `CapacitiveDCBusConverter`, `FrequencyConverter` (6-pulse diode bridge + DC-bus inductor) + TimeSeries.
- `common/model/_pwm.py` — `PWM` protocol, `ZOH`, `CarrierComparison` (N-level quantized carrier).
- `common/model/_simulation.py` — `Simulation`, `SimulationResults`, `SolverCfg`.
- `common/utils/__init__.py` — exports `SequenceGenerator, Step, abc2complex, complex2abc`.
- `common/utils/_utils.py` — `abc2complex`, `complex2abc`, `SequenceGenerator`, `Step`, `wrap`, `NominalValues`, `BaseValues`, `get_value`, `empty_array`, `clip`, `sign`.
- `common/utils/_plotting.py` — `set_screen_style`, `set_latex_style`, `configure_axes`, `save_and_show`.

### `motulator.drive` — machine-drive models, controls, utils
- `drive/__init__.py` — "Drive models and controls", no public symbols.
- `drive/control/__init__.py` — exports the two sub-modules `im`, `sm`.
- `drive/control/_base.py` — `VectorControlSystem`, `VHzControlSystem`, `VectorController`/`VHzController` protocols, `Feedbacks`/`References`/`ExternalReferences`/`Measurements`.
- `drive/control/_common.py` — `SpeedController` (2DOF PI speed loop), `SpeedObserver` (speed + load-torque estimator).
- `drive/control/im.py` — public IM control surface (see §3).
- `drive/control/_im_current_vector.py` — IM current-vector control (FOC): `CurrentController`, `CurrentReferenceGenerator`, `CurrentVectorControllerCfg`, `CurrentVectorController`.
- `drive/control/_im_flux_vector.py` — IM flux-vector control (DTC-like) + V/Hz: `FluxTorqueController`, `ReferenceGenerator`, `FluxVectorControllerCfg`, `FluxVectorController`, `ObserverBasedVHzControllerCfg`, `ObserverBasedVHzController`.
- `drive/control/_im_observers.py` — `FluxObserver`, `SpeedFluxObserver`, `ObserverOutputs`, factory fns `create_sensored_observer` / `create_sensorless_observer` / `create_vhz_observer`.
- `drive/control/sm.py` — public SM control surface (see §3).
- `drive/control/_sm_current_vector.py` — SM current-vector control: `CurrentController`, `CurrentVectorControllerCfg`, `CurrentVectorController`.
- `drive/control/_sm_flux_vector.py` — SM flux-vector control + V/Hz: `FluxTorqueController`, `FluxVectorControllerCfg`, `FluxVectorController`, `ObserverBasedVHzControllerCfg`, `ObserverBasedVHzController`.
- `drive/control/_sm_observers.py` — `FluxObserver`, `SpeedFluxObserver`, `ObserverOutputs`, factory fns (sensored / sensorless / vhz).
- `drive/control/_sm_reference_gen.py` — `ReferenceGenerator` (optimal MTPA/MTPV/current-limit LUT reference generator).
- `drive/control/_sm_signal_inj.py` — `SignalInjectionObserver`, `SignalInjectionController` (square-wave signal injection, low-speed sensorless).
- `drive/model/__init__.py` — exports `Drive, InductionMachine, InductionMachinePars, InductionMachineInvGammaPars, SynchronousMachine, SynchronousMachinePars, SaturatedSynchronousMachinePars, SpatialSaturatedSynchronousMachinePars, MechanicalSystem, TwoMassMechanicalSystem, ExternalRotorSpeed, LCFilter, FrequencyConverter, VoltageSourceConverter, Simulation`.
- `drive/model/_drive.py` — `Drive` (top-level drive Model: converter + machine + mechanics [+ LC filter]).
- `drive/model/_machine.py` — `InductionMachine`, `SynchronousMachine` + Inputs/Outputs/States/History/TimeSeries.
- `drive/model/_mechanics.py` — `MechanicalSystem`, `TwoMassMechanicalSystem`, `ExternalRotorSpeed` + TimeSeries.
- `drive/model/_lc_filter.py` — `LCFilter` (converter output LC filter).
- `drive/utils/__init__.py` — exports `BaseValues, NominalValues, SequenceGenerator, Step, ControlLoci, MachineCharacteristics, MagneticModel, SaturationModelSyRM, SaturationModelPMSyRM, import_syre_data, plot, plot_stator_waveforms, plot_dc_bus_waveforms, plot_map, plot_flux_vs_current`.
- `drive/utils/_parameters.py` — parameter dataclasses (see §2).
- `drive/utils/_plots.py` — `plot`, `plot_stator_waveforms`, `plot_dc_bus_waveforms`.
- `drive/utils/_sm_control_loci.py` — `ControlLoci`, `MTPALocus`, `MTPVLocus`, `CurrentLimitLocus`.
- `drive/utils/_sm_flux_maps.py` — `MagneticModel`, `SaturationModelBase`, `SaturationModelSyRM`, `SaturationModelPMSyRM`, `import_syre_data`.
- `drive/utils/_sm_plot_control_loci.py` — `MachineCharacteristics`.
- `drive/utils/_sm_plot_flux_maps.py` — `plot_map`, `plot_flux_vs_current`.

### `motulator.grid` — grid-converter models, controls, utils
- `grid/__init__.py` — no public symbols.
- `grid/control/__init__.py` — exports `GridConverterControlSystem, CurrentLimiter, DCBusVoltageController, PLL, CurrentController, CurrentVectorController, ObserverBasedGridFormingController, PowerSynchronizationController`.
- `grid/control/_base.py` — `GridConverterControlSystem`, `GridFormingController`/`GridFollowingController` protocols, `Measurements`/`ExternalReferences`.
- `grid/control/_common.py` — `DCBusVoltageController`, `CurrentLimiter`.
- `grid/control/_gfl_current_vector.py` — `PLL`, `CurrentController`, `CurrentVectorController` (grid-following).
- `grid/control/_gfm_observer.py` — `Observer` (disturbance observer), `ObserverBasedGridFormingController`.
- `grid/control/_gfm_psc.py` — `PowerSynchronizationController` (reference-feedforward PSC).
- `grid/model/__init__.py` — exports `GridConverterSystem, LCLFilter, LFilter, ThreePhaseSource, Simulation, VoltageSourceConverter, CapacitiveDCBusConverter`.
- `grid/model/_converter_system.py` — `GridConverterSystem` (top-level grid Model).
- `grid/model/_ac_filter.py` — `LFilter`, `LCLFilter` (+ grid impedance, PCC voltage) + TimeSeries.
- `grid/model/_ac_source.py` — `ThreePhaseSource` (unbalanced source via negative-sequence).
- `grid/utils/__init__.py` — exports `BaseValues, NominalValues, plot_control_signals, plot_grid_waveforms, plot_voltage_vector, Step, SequenceGenerator`.
- `grid/utils/_plots.py` — `plot_control_signals`, `plot_grid_waveforms`, `plot_voltage_vector`.

---

## 2. Motor models (`motulator.drive.model`)

All continuous-time, peak-valued complex space vectors, SI units. States stored as complex
flux linkages; outputs computed algebraically.

### Induction machine
- `InductionMachine(par)` — Γ-equivalent model (`_machine.py`). States `psi_s_ab`, `psi_r_ab` (Vs). Outputs `i_s_ab`, `i_r_ab` (A), `tau_M` (Nm). `L_s` may be a callable of `abs(psi_s)` → main-flux saturation. `meas_currents()` → phase currents. Time series: `machine.psi_s_ab, psi_r_ab, i_s_ab, i_r_ab, tau_M, u_s_ab, w_M, psi_R_ab, w_m`.
  - Accepts either Γ or inverse-Γ pars; inverse-Γ is auto-converted via `InductionMachinePars.from_inv_gamma_pars`.
- `InductionMachinePars` (Γ, `drive/utils/_parameters.py`) — fields `n_p, R_s, R_r, L_ell, L_s` (`L_s` float | callable). Derived props: `gamma`, `L_M`, `L_sgm`, `R_R`, `R_sgm`, `alpha`, `w_rb`. `update_psi_s(psi_s)` for saturation state. Classmethod `from_inv_gamma_pars(par)` (constant-param transform).
- `InductionMachineInvGammaPars` (inverse-Γ, control-oriented) — fields `n_p, R_s, R_R, L_sgm, L_M`. Props `R_sgm, alpha, w_rb`. Classmethod `from_gamma_pars(par)`.

Γ vs inverse-Γ: `InductionMachine` simulates the Γ model; controls consume inverse-Γ
parameters. The inverse-Γ leakage `L_sgm` and magnetizing `L_M` map 1:1 onto the control
gains (`CurrentController` gains use `L_sgm`; observer uses `alpha = R_R/L_M`, `w_rb`).

### Synchronous machine (covers PMSM / IPMSM / SPMSM / SyRM)
- `SynchronousMachine(par)` (`_machine.py`) — general SM model, internally in rotor
  coordinates. States `psi_s_dq`, `exp_j_theta_m`. Outputs `i_s_ab`, `i_s_dq`, `tau_M`.
  `meas_currents()`. Time series: `machine.psi_s_dq, psi_s_ab, i_s_dq, i_s_ab, tau_M, u_s_ab, w_M, w_m, theta_m`.
  - Accepts `SynchronousMachinePars | SaturatedSynchronousMachinePars | SpatialSaturatedSynchronousMachinePars`.
  - **There is NO separate SPMSM/IPMSM/SyRM subclass.** The one `SynchronousMachine` +
    `SynchronousMachinePars(L_d, L_q, psi_f)` spans them all: `L_d == L_q` → SPMSM,
    `L_d < L_q` → IPMSM, `psi_f == 0` → synchronous reluctance machine. This is the 
    machine-type selector, not a class hierarchy. [verify-in-Phase-2 if a test needs a
    named SyRM/PMSM type — the library uses parameters, not names.]
- `SynchronousMachinePars` (linear, no saturation) — fields `n_p, R_s, L_d, L_q, psi_f`.
  Provides `i_s_dq(psi)`, `psi_s_dq(i)`, `incr_ind_mat(i)` (= diag(L_d, L_q)), and
  `aux_flux` / `aux_current` (needed by MTPA/MTPV machinery).
- `SaturatedSynchronousMachinePars` (nonlinear current/flux maps) — fields `n_p, R_s`,
  `i_s_dq_fcn` (current vs flux, used by model), `psi_s_dq_fcn` (flux vs current, used by
  controls), `use_iterative_current` (root-find current from flux map when only the flux
  map is given). `psi_f` auto-derived (root of d-axis current). `incr_ind_mat` via finite
  differences. Controls support this class (flux-map-based current controller).
- `SpatialSaturatedSynchronousMachinePars` (high-fidelity sim-only) — fields `n_p, R_s`,
  `i_s_dq_fcn(psi_s_dq, exp_j_theta_m)` (angle-dependent current map) and
  `tau_M_ripple_fcn(psi_s_dq, exp_j_theta_m)` (torque ripple). **Controls do NOT support
  spatial harmonics** (`psi_s_dq` / `incr_ind_mat` raise NotImplementedError). Simulation-only.

### Mechanics (load side)
- `MechanicalSystem(J, B_L=0.0)` — stiff one-mass; `B_L` constant or callable of `w_M`
  (e.g. `lambda w_M: k*abs(w_M)` → quadratic load). `set_external_load_torque(tau_L)`,
  `meas_position()`, `meas_speed()`. Time series `mechanics.w_M, tau_L_tot, theta_M`.
- `TwoMassMechanicalSystem(J_M, J_L, K_S, C_S, B_L=0.0)` — resonant two-mass (torsional shaft
  `K_S`, `C_S`); extra `meas_load_speed()`, `meas_load_position()`.
- `ExternalRotorSpeed()` — speed prescribed by `set_external_rotor_speed(w_M(t))` instead of
  torque dynamics (e.g. for stiff-grid / motoring tests). [capsule-only]

### Converter side (drive)
- `VoltageSourceConverter(u_dc)` — lossless, constant DC bus. `meas_dc_voltage()`.
- `CapacitiveDCBusConverter(u_dc, C_dc)` — DC-bus capacitance dynamics; `set_external_dc_current(i_dc(t))`.
- `FrequencyConverter(C_dc, L_dc, U_g, f_g)` — 6-pulse diode bridge + DC-bus inductor
  (regeneration not possible). [capsule-only — production subclasses `CapacitiveDCBusConverter`]
- `LCFilter(L_f, C_f, R_f=0.0)` — optional converter output filter.

---

## 3. Control methods (`motulator.drive.control`)

Top-level: `drive.control.im` and `drive.control.sm` expose the per-machine-type controllers.

### Common control-system shells (`_base.py`)
- `VectorControlSystem(vector_ctrl, speed_ctrl=None)` — outer loop; speed-control mode
  (`set_speed_ref(f(t))`) or torque-control mode (`set_torque_ref(f(t))`). `[production-used]`
- `VHzControlSystem(vhz_ctrl, slew_rate=inf)` — V/Hz shell; `set_speed_ref`, rate-limited ramp.

### Induction machine — `drive.control.im`
| Class | Method | sensorless? | T_s default |
|---|---|---|---|
| `CurrentVectorController(par, cfg, sensorless=True, T_s=125e-6)` | current-vector (FOC) | yes (SpeedFluxObserver) / sensored | 8 kHz |
| `CurrentVectorControllerCfg(psi_s_nom, i_s_max, alpha_c=2π·200, alpha_i, alpha_o, k_o, w_s_nom=2π·50, k_u=0.95, k_fw, J)` | config for above | — | — |
| `FluxVectorController(par, cfg, sensorless=True, T_s=125e-6)` | flux-vector (stator-flux + torque control) | yes / sensored | 8 kHz |
| `FluxVectorControllerCfg(psi_s_nom, i_s_max, alpha_tau=2π·100, alpha_psi, alpha_i, alpha_o, k_o, alpha_c, tau_M_max, k_u=0.9, k_b=0.9, J)` | config | — | — |
| `ObserverBasedVHzController(par, cfg, T_s=250e-6)` | observer-based V/Hz (sensorless) | always sensorless | 4 kHz |
| `ObserverBasedVHzControllerCfg(psi_s_nom, i_s_max, alpha_psi=2π·100, alpha_tau=2π·20, alpha_f=2π·1, k_o, k_u, k_b)` | config | — | — |

Inner components (exposed in `im.__all__`): `CurrentController` (ComplexPI), 
`CurrentReferenceGenerator` (field-weakening + breakdown-slip current limiting), 
`ReferenceGenerator` (flux-vector ref gen), `FluxTorqueController` (direct flux+torque
voltage control), `FluxObserver`, `SpeedFluxObserver`, `SpeedController`, `SpeedObserver`,
`PIController`, plus observer factory fns.

`FluxVectorController` + `SpeedController` + `VectorControlSystem` + `set_speed_ref` is the
exact stack production uses (sensorless, `J` passed to cfg so the mechanical model feeds
speed estimation).

### Synchronous machine — `drive.control.sm`
| Class | Method | sensorless? | T_s default |
|---|---|---|---|
| `CurrentVectorController(par, cfg, sensorless=True, T_s=125e-6)` | current-vector (FOC) | yes / sensored | 8 kHz |
| `CurrentVectorControllerCfg(i_s_max, alpha_c=2π·200, alpha_i, alpha_o, k_o, k_f, psi_s_min, psi_s_max, k_u=0.9, k_mtpv=0.9, J)` | config | — | — |
| `FluxVectorController(par, cfg, sensorless=True, T_s=125e-6)` | flux-vector | yes / sensored | 8 kHz |
| `FluxVectorControllerCfg(i_s_max, alpha_tau=2π·100, alpha_psi, alpha_i, alpha_o, k_o, k_f, psi_s_min, psi_s_max, k_u=0.9, k_mtpv=0.85, J)` | config | — | — |
| `ObserverBasedVHzController(par, cfg, T_s=250e-6)` | observer-based V/Hz (sensorless) | always sensorless | 4 kHz |
| `ObserverBasedVHzControllerCfg(i_s_max, alpha_psi=2π·100, alpha_tau=2π·20, alpha_f=2π·1, alpha_o=2π·200, k_o, k_u, k_mtpv, psi_s_min, psi_s_max)` | config | — | — |
| `SignalInjectionController(par, cfg, U_inj=250, T_s=125e-6)` | square-wave signal injection (low-speed sensorless) | always sensorless | 8 kHz |

Inner components: `ReferenceGenerator` (optimal MTPA/MTPV/current-limit LUT generator —
`compute_flux_and_torque_refs(tau_M_ref, w_m, u_dc)`, `compute_current_ref(...)`),
`FluxTorqueController`, `CurrentController` (flux-linkage-based, saturation-aware),
`FluxObserver` / `SpeedFluxObserver` / `ObserverOutputs`, `SignalInjectionObserver`,
`create_sensored_observer` / `create_sensorless_observer` / `create_vhz_observer`.

### Observer semantics
- IM `FluxObserver` — reduced-order flux observer in synchronous coords (`k_o1`, `k_o2`
  gains); voltage-model = zeros; current-model = k_o1=1. `SpeedFluxObserver` adds speed
  (and load-torque if `J`) estimation. Factories:
  `create_sensored_observer(par, k_o)`, `create_sensorless_observer(par, alpha_o, k_o, J)`,
  `create_vhz_observer(par, k_o)`.
- SM `FluxObserver` — estimates stator flux, rotor angle (and PM flux `psi_f` if `k_f`).
  `SpeedFluxObserver` adds speed/load torque. Factories with `k_theta`, `k_o`, `k_f`, `J`.
- `ObserverOutputs` is the shared feedback dataclass (fields `u_dc, i_s, u_s, psi_s, psi_R,
  tau_M, tau_L, w_c, w_s, w_r, w_m, w_M, theta_c, e_o, eps` for IM; SM variant has
  `theta_m, psi_f, psi_a, eps_f`).

### Speed/torque limits — what exists vs not
- No class literally named `w_lim` / speed-limiter. [verify-in-Phase-2]
- Field-weakening (voltage limit vs speed) lives inside reference generators:
  IM `CurrentReferenceGenerator.update` (integral `i_sd_ref`, `u_s_max = k_u·u_dc/√3`, `k_fw`)
  and IM `ReferenceGenerator.compute_output` (`psi_s_max = u_s_max/|w_s|`); SM
  `ReferenceGenerator._get_max_flux` (same `u_s_max/|w_m|`).
- Torque/current limits: `SpeedController(tau_M_max)` output clamp; `CurrentVectorControllerCfg.i_s_max`
  → current-limit loci (SM MTPA/MTPV/current-limit LUTs); IM breakdown-slip current limit.
- Speed-reference slew: `VHzControlSystem(slew_rate)` via `RateLimiter`.

---

## 4. Solver + measurement + data logging

### Simulation engine
- `Simulation(mdl, ctrl, show_progress=True, cfg=None)` (`common/model/_simulation.py`).
  `simulate(t_stop=1.0) -> SimulationResults`. `[production-used]`
- Main loop: `ctrl(mdl)` → `(T_s, ref_duty_ratio)`; `mdl.delay(ref_duty_ratio)` (computational
  delay); `mdl.pwm(T_s, duty_ratio)` → `(t_steps, sw_states)`; per switching interval
  `solve_ivp(self.mdl.rhs, t_span, state0, **cfg.solver)`.
- ODE backend: `scipy.integrate.solve_ivp` (hard-coded). `SolverCfg.method` is passed
  through verbatim, so any solve_ivp method works (RK45 default; RK23/DOP853/BDF/LSODA/
  Radau etc.). `[verify-in-Phase-2 for exact non-default-method behaviour]`
- `SolverCfg` dataclass (`common/model/_simulation.py`): `max_step: float = inf`,
  `method: str = "RK45"`, `rtol: float = 1e-3`, `atol: float = 1e-6`; `.solver` property →
  dict for `solve_ivp`. `[production-used]` (production passes `SolverCfg(max_step=1e-3, method="RK45")`).
- `SimulationResults(mdl: ModelTimeSeries, ctrl: Any)` — `res.mdl` = continuous-time traces,
  `res.ctrl` = discrete control traces. `[production-used]` (type: `res.mdl`, `res.ctrl`).
- `FloatingPointError` (e.g. NaN) is caught → prints `Invalid value encountered at {t} s.` and
  returns partial results (no exception). Useful trap for motor-start divergence.

### Delay model
- `Delay(length=1, elem=3)` (`common/model/_base.py`) — ring buffer; `mdl.delay(u)`.
  `Model(pwm=False, delay=0)`; `Drive(...)` default `delay=1`. Production drive path: 
  `delay=1` sample computational delay.
- `pwm` flag on `Model`/`Drive`: `False` → `ZOH` (duty ratios held over the whole sample);
  `True` → `CarrierComparison(N=2**12, return_complex=True)` (explicit switching instants,
  faster). Production uses `pwm=False` (ZOH).

### PWM (`common/control/_pwm.py`)
- `PWM(k_comp=1.5, u_c0_ab=0j, overmodulation="MPE")` — space-vector PWM + overmodulation
  `"MPE"` (min phase error) / `"MME"` (min magnitude error) / `"six_step"`; angular-delay
  compensation `k_comp·T_s·w`; `get_realized_voltage()` for feedback. Used internally by
  `VectorControlSystem` / `VHzControlSystem` / `GridConverterControlSystem` (public class).

### Data logging / result objects
- `ModelTimeSeries` (`common/model/_base.py`): `res.mdl.t`; per-subsystem namespace
  attributes from `create_time_series` — `res.mdl.machine.*`, `res.mdl.mechanics.*`,
  `res.mdl.converter.*`, `res.mdl.lc_filter.*`; plus ZOH inputs (e.g. `sw_state`) and
  derived signals. `res.mdl.machine.w_M` / `tau_M` / `psi_s_ab` and
  `res.mdl.mechanics.tau_L_tot` are the fields production reads.
- `TimeSeries` (`common/control/_base.py`): `res.ctrl.t`, `res.ctrl.ref` and `res.ctrl.fbk`
  as `SimpleNamespace` arrays (e.g. `ctrl.fbk.w_M`, `ctrl.fbk.tau_M`, `ctrl.fbk.i_s`,
  `ctrl.ref.psi_s`, `ctrl.ref.tau_M`). `ControlSystem.post_process()` builds it.

---

## 5. Utility functions

### Reference / sequence generation (`common/utils/_utils.py`)
- `SequenceGenerator(times, values, periodic=False)` — np.interp piecewise sequence (callable of t).
- `Step(step_time, step_value, initial_value=0.0)` — step reference (callable of t).
  (No separate `Ramp` class; ramps are `SequenceGenerator` points or `VHzControlSystem`
  slew-rate. [verify-in-Phase-2])
- `abc2complex(abc)`, `complex2abc(uvw)` — Clarke transforms, **peak-value scaling**.

### Per-unit conventions
- `NominalValues(U, I, f, P, tau=0)` — U rms line-line (V), I rms (A), f (Hz), P (W).
- `BaseValues.from_nominal(nom, n_p)` — derives `u = √(2/3)·U` (peak line-neutral),
  `i = √2·I` (peak), `w = 2π·f`, `psi = u/w`, `p = 1.5·u·i`, `Z = u/i`, `L = Z/w`,
  `C = 1/(Z·w)`, and with `n_p`: `tau = n_p·p/w`, `w_M = w/n_p`.
  Note docstring: nominal torque > base torque (power factor/efficiency < 1). `[production-used]`
- `BaseValues.unity()` — all-1 base (plots raw SI by default when base=None).

### Plot helpers
- Drive: `plot(res, base=None, ...)` (5-panel: speeds/torques/currents/voltages/flux),
  `plot_stator_waveforms(res, ...)`, `plot_dc_bus_waveforms(res, ...)`.
- Grid: `plot_control_signals(res, ...)`, `plot_grid_waveforms(res, ...)`,
  `plot_voltage_vector(res, ...)`.
- SM analysis: `MachineCharacteristics(par)` → `plot_flux_loci`, `plot_current_loci`,
  `plot_flux_vs_torque`, `plot_current_vs_torque`; `plot_map(data, component, ...)` (3D),
  `plot_flux_vs_current(data, ...)`.
- Common: `set_screen_style()`, `set_latex_style()`, `save_and_show(save_path=None, **kwargs)`
  (all with `save_path` + `bbox_inches="tight"` default). LaTeX mode needs a TeX install.

### SM magnetic analysis (`drive/utils`)
- `ControlLoci(par)` — MTPA / MTPV / constant-current loci:
  `compute_mtpa_locus(i_s_max)`, `compute_mtpv_locus(i_s_max)`,
  `compute_const_current_locus(i_s_max)`, `compute_mtpa_current_angle`,
  `compute_mtpv_current_angle`, `solve_current_for_mtpv_torque`. Returns `MTPALocus` /
  `MTPVLocus` / `CurrentLimitLocus` dataclasses with interpolation callables.
- `MagneticModel(i_s_dq, psi_s_dq, tau_M=None, type="flux_map")` — flux/current map container;
  `create_interpolated_model(..., invert=)`, `invert()`, callable LUT.
- `SaturationModelSyRM(a_d0, a_dd, a_q0, a_qq, a_dq, S, T, U, V)` — analytical SyRM
  self+cross saturation; `SaturationModelPMSyRM(psi_n, a_b, a_bp, W, k_q, ...)` adds bridge
  saturation (PM-assisted). Both usable as `i_s_dq_fcn`.
- `import_syre_data(fname, add_negative_q_axis=True)` — load SyR-e MATLAB flux maps
  (THOR.mat etc., Apache-2.0 data) → `MagneticModel`.

---

## 6. What production touches vs the rest

Source of truth for `[production-used]`: `MECHANICS/selection/asinc_inv_simulation/
simulate_motor.py` (imports at lines 74–79; usage lines ~359–533) and
`tests/test_simulate_motor.py`.

### Production-used
| API | Where |
|---|---|
| `motulator.drive.control.im` (module) | simulate_motor.py:74 |
| `im.FluxVectorController`, `im.FluxVectorControllerCfg` | lines 493, 500 (sensorless=True, J=J_eq) |
| `im.SpeedController`, `im.VectorControlSystem` | lines 512, 515 |
| `VectorControlSystem.set_speed_ref(...)` | line 520 |
| `motulator.common.model.Simulation`, `SolverCfg` | lines 76, 529, 533 (`SolverCfg(max_step=1e-3, method="RK45")`) |
| `motulator.common.model.SimulationResults` | line 410 (type ref) |
| `motulator.common.model._converter.CapacitiveDCBusConverter` | line 77 — **subclassed** (`BrakingChopperConverter`, line 102: overrides `rhs`, uses `compute_internal_dc_current`, `state.u_dc`) |
| `motulator.drive.model.Drive`, `InductionMachine`, `MechanicalSystem` | lines 457, 469, 481 (`MechanicalSystem(J=J_eq, B_L=0.0)`) |
| `motulator.drive.utils.NominalValues`, `BaseValues.from_nominal` | lines 359, 366 |
| `motulator.drive.utils._parameters.InductionMachinePars` | lines 370–372 (Γ-model mapping) |
| `sim.simulate(t_stop)` | line ~536 |

### Capsule-only (not used by production today) — the gap the capsule must serve
- **Entire `motulator.grid` subpackage** — grid-following (`PLL`, `CurrentVectorController`,
  `DCBusVoltageController`), grid-forming (`ObserverBasedGridFormingController`,
  `PowerSynchronizationController`), L/LCL filters, `ThreePhaseSource` (unbalanced).
- **All synchronous-machine controls** (`drive.control.sm`) — FOC, flux-vector, V/Hz,
  `SignalInjectionController`, optimal `ReferenceGenerator` (MTPA/MTPV).
- **IM current-vector control** (`CurrentVectorController`, `CurrentReferenceGenerator`) —
  production uses flux-vector only.
- **IM V/Hz control** (`ObserverBasedVHzController`, `VHzControlSystem`).
- **Sensored (encoder) paths** — production runs sensorless; sensored observers/`sensorless=False`
  unused.
- **Direct observer use** — `FluxObserver`, `SpeedFluxObserver`, observer factories.
- **Mechanics variants** — `TwoMassMechanicalSystem` (resonant shaft), `ExternalRotorSpeed`,
  load-torque callables (`B_L(w_M)`, `set_external_load_torque`).
- **`FrequencyConverter`** (diode-bridge + DC-bus inductor) — production builds its own
  `CapacitiveDCBusConverter` subclass instead.
- **`LCFilter`** (converter output LC filter).
- **SM magnetic analysis** — `ControlLoci`, `MagneticModel`, `SaturationModelSyRM/PMSyRM`,
  `import_syre_data`, `MachineCharacteristics`, `plot_map` / `plot_flux_vs_current`.
- **`SequenceGenerator` / `Step`** reference objects (production writes its own callables).
- **`CarrierComparison` PWM mode** (`pwm=True`) — production uses ZOH (`pwm=False`).
- **Grid plot helpers** (`plot_control_signals`, `plot_grid_waveforms`, `plot_voltage_vector`).
- **`SpatialSaturatedSynchronousMachinePars`** — high-fidelity sim-only SM with torque ripple.

---

## 7. Version pin + verification flags

- Installed: `motulator 0.7.3` (confirmed via dist-info METADATA). Upstream latest tags:
  v0.7.3 (2024-era), v0.7.4, v0.7.5 — pin 0.7.3 on every proven script/card.
- Example sources for Phase 2 (upstream `examples/` at tag `v0.7.3`):
  - `examples/drive/current_vector/` — plot_2kw_im_cvc_tq, plot_2kw_im_sat_cvc,
    plot_2kw_ipmsm_cvc_adapt, plot_2kw_ipmsm_diode_cvc, plot_5kw_pmsyrm_thor_sat_cvc,
    plot_7kw_syrm_cvc (+ THOR.mat)
  - `examples/drive/flux_vector/` — plot_2kw_im_sat_fvc, plot_2kw_ipmsm_fvc,
    plot_5kw_pmsyrm_thor_sat_fvc, plot_6kw_pmsyrm_sat_fvc, plot_7kw_syrm_sat_fvc
    (+ ABB_400rpm_map.mat, THOR.mat)
  - `examples/drive/signal_inj/` — plot_2kw_ipmsm_signal_inj, plot_7kw_syrm_signal_inj
  - `examples/drive/vhz/` — plot_2kw_im_diode_vhz, plot_2kw_im_lc_vhz, plot_2kw_im_ovhz,
    plot_2kw_ipmsm_2mass_ovhz, plot_2kw_ipmsm_ovhz, plot_7kw_syrm_sat_ovhz
  - `examples/grid/grid_following/` — plot_10kva_gfl, plot_10kva_lcl_gfl, plot_10kva_dc_bus_gfl
  - `examples/grid/grid_forming/` — plot_13kva_rfpsc_gfm, plot_13kva_do_gfm
- Flags carried into Phase 2:
  - `[verify-in-Phase-2]` — no `w_lim`-named speed-limit class exists; no `Ramp` class
    (use `SequenceGenerator`/slew-rate); non-RK45 `SolverCfg.method` passthrough behaviour;
    whether SyRM/PMSM need named convenience types (library is parameter-driven, not
    subclass-driven).
