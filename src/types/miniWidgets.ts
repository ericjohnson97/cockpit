/**
 * Available components to be used in the Mini Widget system
 * The enum value is equal to the component's filename, without the '.vue' extension
 */
export enum MiniWidgetType {
  ArmerButton = 'ArmerButton',
  BaseCommIndicator = 'BaseCommIndicator',
  BatteryIndicator = 'BatteryIndicator',
  DepthIndicator = 'DepthIndicator',
  RelativeAltitudeIndicator = 'RelativeAltitudeIndicator',
  TakeoffLandCommander = 'TakeoffLandCommander',
  VeryGenericIndicator = 'VeryGenericIndicator',
  JoystickCommIndicator = 'JoystickCommIndicator',
  MiniVideoRecorder = 'MiniVideoRecorder',
  ModeSelector = 'ModeSelector',
  SatelliteIndicator = 'SatelliteIndicator',
  ViewSelector = 'ViewSelector',
}

export type MiniWidget = {
  /**
   * Unique identifier for the widget
   */
  hash: string
  /**
   * Component type of the widget
   */
  component: MiniWidgetType
  /**
   * Internal options of the widget
   */
  options: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  /**
   * External variables used by the widget manager
   */
  managerVars: {
    /**
     * Number of times the mini-widget was mounted
     */
    timesMounted: number
    /**
     * If the configuration menu is open or not
     */
    configMenuOpen: boolean
  }
}

export type MiniWidgetContainer = {
  /**
   * Array of widgets that are stored in the container
   */
  widgets: MiniWidget[]
  /**
   * Editable name for the container
   */
  name: string
}

export type MiniWidgetProfile = {
  /**
   * Array of views that are stored in the profile
   */
  containers: MiniWidgetContainer[]
  /**
   * Editable name for the profile
   */
  name: string
}
