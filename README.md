# Starting the framework with sample plugins

## 1. Set Up Credentials
### Unsplash API key
Required for one of the sample data plugins. Please have `REACT_APP_UNSPLASH_API_KEY="---your unsplash api key---"` in `frontend/.env` in order to access that data plugin. Instructions on how to set up can be found in `frontend/README`.
### Google Cloud Vision Credentials
A`credentials.json` with Google Cloud Vision API credentials is required in `backend/src/main/resources`. Instructions on how to set up can be found in `backend/README`.
## 2. Set Up Backend
In the backend folder, run

`mvn exec:exec`

This will start Java server at localhost:8080
## 3. Set Up Frontend
In the frontend folder, run

`npm install --f`

`npm start`

This will start the frontend server at localhost:3000, where you can interact with the framework GUI and try the sample plugins

# Framework
## Description

The framework performs image analysis on images from different sources provided by data plugins and shows results in different ways using visualization plugins. The framework performs these image analysis itself using various [Google’s Cloud Vision APIs](https://cloud.google.com/vision/docs/how-to), thus providing the benefits for reuse.

## Data Processing

As stated above, the framework will be doing data processing using a machine-learning API by [Google’s Cloud Vision APIs](https://cloud.google.com/vision/docs/how-to) for various image analysis such as object detection, label detection, etc. A sample framework response can be found in `frontend/src/sampleData.json`. Note that a `credentials.json` with Google Cloud Vision API crendentials is required in `backend/src/main/resources`. Instructions on how to set up can be found in `backend/README`.

## Backend Interaction with Plugins
Data plugin backends won't be able to call framework methods.

## Frontend Interaction with Plugins
Visualization plugins can directly interact with this frontend framework interface.
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

## Response
A sample framework response can be found in `frontend/src/sampleData.json`.

## Demo
A demo of the sample plugins with the framework can be found [here](https://drive.google.com/file/d/1Q-mH-wsFfE7DzKTeTKtJ50xGOFKY20PI/view?usp=sharing)

# Data Plugin
This framework requires data plugins to have a backend and a frontend because of the designed flexibility with user inputs. Data plugin decides whether it want to take in an image file, image url, or anything. The frontend data plugin should render the component that takes in user input, and handle the preparation of `FormData` to be used by the framework to communicate with the backend. The data plugin backend should be able to obtain the data they send from `IHTTPSession session` and produce the base64 string from the image(s).

 The followings are some sample data plugins we implemented that takes in different types of user input:
- Web Scaper: takes in an url and grabs the image(s) that website contains
    
    Note: Please be mindful about not violating any copy rights when using this plugin! This is made for educational purposes only.
- Unsplash: gets a random image using the unsplash API (NEEDS API KEY)
    
    In order to use this plugin, please have `REACT_APP_UNSPLASH_API_KEY="---your api key---"` in `frontend/.env`
- Upload: allows uploading local image(s)

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

# Visualization Plugins
The visualization plugin is only a frontend plugin that's able to get data from the frontend framework.

The followings are some visualization plugins we implemented: 
- Word Cloud: produces word cloud with labels and objects from the image(s)
- Bar Graph: produces a bar graph with the labels generated from the image(s)
- Pie Chart: produces a pie chart using the top 8 dominant colors from the image(s)

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
