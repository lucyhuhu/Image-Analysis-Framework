# Domain

The framework performs image analysis on images from different sources provided by data plugins and shows results in different ways using visualization plugins. The types of image analysis include object detection, label generation, emotion recognition for images containing faces, face recognition, landmark detection. More detailed documentations on those methods as well as related methods can be found in [Google’s Cloud Vision APIs](https://cloud.google.com/vision/docs/how-to).

## Data Processing

As stated above, the framework will be doing data processing using a machine-learning API by [Google’s Cloud Vision APIs](https://cloud.google.com/vision/docs/how-to) for various image analysis such as object detection, label detection, etc. A sample framework response can be found in `frontend/src/sampleData.json`. Note that a `credentials.json` with Google Cloud Vision API crendentials is required in `backend/src/main/resources`. Instructions on how to set up can be found in `backend/README`.

## Data Plugins

Data plugins could provide images from various sources, potential data plugins include:

- Web Scaper: takes in an url and grabs the image(s) that website contains
- Unsplash: gets a random image using the unsplash API (NEEDS API KEY)
  In order to use this plugin, please have `REACT_APP_UNSPLASH_API_KEY="---your api key---"` in `frontend/.env`
- Upload: allows uploading local image(s)
- Many other interesting image and photo related APIs could be added as potential data plugins ([DALL·E](https://openai.com/research/dall-e), [Cat API](https://thecatapi.com/))

## Visualization Plugins

The framework then provides a list of objects recognized with scores, labels with scores, etc. to visualization plugins. Visualization plugins could include:

- Word Cloud: produces word cloud with labels and objects from the image(s)
- Bar Graph: produces a bar graph with the labels generated from the image(s)
- Pie Chart: produces a pie chart using the top 8 dominant colors from the image(s)

# Generality vs Specificity

## Key Abstractions
```
/**
* Gets processed images data.
*/
getData: () => JSON

/**
* Gets the images in base64 strings.
*/
getImages: () => string[]
```
The key abstraction of the framework lies within the image processing using the Google Cloud Vision API. With the images supplied by data plugins, the framework uses Google Cloud Vision to generate a wide range of data (see a sample response in `frontend/src/sampleData.json`) which the visualization plugins can then use to generate visualizations of their choice. The framework asks the data plugins to be able to return the base64 image string but lets data plugins decide on their own input type, giving full flexibility the handling of user input.

## Reusable Functionality of Framework

- The framework supports loading data and visualization plugins without having any changes to the core framework code. Instructions on loading plugins can be found in the root directory `README`.
- The framework takes care of majority of frontend UI, only minor components are required by the plugins.
- The framework can support processing any number of images, giving data plugins more flexibility with potential opportunities.
- The framework does not restrict on the type of user input on the frontend. This is done through allowing data plugins to render their component with handling user input and preparing `FormData` to be sent. Framework only asks that data plugin is able to return base64 string for the images but does not limit on the way of getting them.

## Potential Flexibility of Plugins
Various data plugins could be used to grab the image(s) for further processing, and various visualization plugins could be implemented to utilize different visualization methods with the data that framework provides. The framework is able to image data related to `TEXT_DETECTION`, `LANDMARK_DETECTION`, `IMAGE_PROPERTIES`, `LABEL_DETECTION`, `FACE_DETECTION`, `OBJECT_LOCALIZATION` as shown in the sample response in `frontend/src/sampleData.json` allowing many possibilities. Our sample plugins show a wide range of ways to get the image(s) and produce visualizations. 

# Project Structure

All of the base framework will likely be contained within package `edu.cmu.cs214.hw6`. framework (containing framework-related files and plugin interface) and plugin (containing plugin implementations) are organized parallelly.

For backend, data plugin backends won't be able to call framework methods. For frontend, visualization plugins can directly interact with this frontend framework interface.
Frontend data plugins won't be able to call framework methods.

```
  /**
   * Gets processed images data.
   */
  getData: () => JSON
  /**
   * Gets the images in base64 strings.
   */
  getImages: () => string[]
```

# Plugin Interfaces

The main method of communication between the plugin and the framework is through
the transformed image when passing from a data plugin to the framework, and the
resultant processed Google API's data from the framework to the visualization plugin.

## Data Plugin Backend Interface

The data plugin backend should be able to obtain the data they send from the `IHTTPSession session`.

```
    /**
     * Gets the name of the plugin.
     * Note that this should match with the frontend.
     */
    String getName();
    /**
     * Returns the images in base64 string.
     * Note that this should match with the frontend.
     */
    String[] getImages(IHTTPSession session);
    /**
    * Called (only once) when the plug-in is first registered with the
    * framework, giving the plug-in a chance to perform any initial set-up
    * (if necessary).
    */
    void onRegister();
```

## Data Plugin Frontend Interface

Data plugins have the flexibility to define what type of user input they accept on the frontend and structure `FormData` accordingly to communicate with their backend.

```
  /**
   * Gets the name of the plugin.
   * Note that this should match with the backend.
   */
  getName: () => string
  /**
   * Gets the description of this plugin
   */
  getDescription () => string
  /**
   * Renders frontend component for this plugin
   */
  render () => JSX.Element

  /**
   * Gets the form data to send to framework
   */
  getFormData: () => FormData
  /**
   * Called (only once) when the plug-in is first registered with the
   * framework, giving the plug-in a chance to perform any initial set-up
   * (if necessary).
   */
  onRegister: () => void
```

## Data Plugin Loading

### Backend

Refer to file `backend/src/main/resources/META-INF/services/edu.cmu.cs214.hw6.framework.DataPluginBackEnd`

### Frontend

Refer to file `frontend\src\pluginloader.ts`. Note that the plugins need to be imported and then added to the data plug array (`dataPlugins`)

## Visualization Front-end Interface

```
  /**
   * Gets the name of the plugin.
   */
  getName: () => string
  /**
   * Gets the description of this plugin
   */
  getDescription () => string
  /**
   * Renders frontend component for this plugin
   */
  render () => JSX.Element

  /**
   * Called (only once) when the plug-in is first registered with the
   * framework, giving the plug-in a chance to perform any initial set-up
   * (if necessary).
   *  @param framework The {@link FrameworkFrontend} instance
   *                   with which the plugin was registered.
   */
  onRegister: (framework: FrameworkFrontend) => void
```

## Visualization Plugin Loading

Similar to frontend data plugin loading, refer to file `frontend\src\pluginloader.ts`. Note that the plugins need to be imported and then added to the visualization plug array (`visPlugins`)
