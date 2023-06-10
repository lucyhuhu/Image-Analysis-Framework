package edu.cmu.cs214.hw6.framework;

import com.google.cloud.vision.v1.AnnotateImageRequest;
import com.google.cloud.vision.v1.AnnotateImageResponse;
import com.google.cloud.vision.v1.BatchAnnotateImagesResponse;
import com.google.cloud.vision.v1.ColorInfo;
import com.google.cloud.vision.v1.DominantColorsAnnotation;
import com.google.cloud.vision.v1.EntityAnnotation;
import com.google.cloud.vision.v1.FaceAnnotation;
import com.google.cloud.vision.v1.Feature;
import com.google.cloud.vision.v1.Feature.Type;
import com.google.cloud.vision.v1.Image;
import com.google.cloud.vision.v1.ImageAnnotatorClient;
import com.google.cloud.vision.v1.ImageAnnotatorSettings;
import com.google.cloud.vision.v1.LocalizedObjectAnnotation;
import com.google.cloud.vision.v1.LocationInfo;
import com.google.auth.Credentials;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.protobuf.ByteString;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONObject;

public class CloudVision {

  /**
   * The features of Google Cloud Vision that are supported by the framework.
   * For a full list of features, see https://cloud.google.com/vision/docs/features-list.
   */
  public static final Set<Type> SUPPORTED_TYPES = new HashSet<>(Arrays.asList(
      Type.TEXT_DETECTION,
      Type.FACE_DETECTION,
      Type.LABEL_DETECTION,
      Type.LANDMARK_DETECTION,
      Type.IMAGE_PROPERTIES,
      Type.OBJECT_LOCALIZATION));

  /**
   * Converts a string, which is a base64 representation of an image, to a byte array.
   * @param base64String The base64 string.
   * @return The converted byte array.
   */
  public static byte[] base64ToByteArray(String base64String) {
    return Base64.getDecoder().decode(base64String);
  }

  private static JSONArray getTextAnnotationsJson(AnnotateImageResponse res) {
    JSONArray jsonAnnotations = new JSONArray();
    for (EntityAnnotation annotation : res.getTextAnnotationsList()) {
      JSONObject jsonAnnotation = new JSONObject();
      jsonAnnotation.put("text", annotation.getDescription());
      jsonAnnotation.put("bounding_box", annotation.getBoundingPoly());
      jsonAnnotations.put(jsonAnnotation);
    }
    return jsonAnnotations;
  }

  private static JSONArray getFaceAnnotationsJson(AnnotateImageResponse res) {
    JSONArray jsonAnnotations = new JSONArray();
    for (FaceAnnotation annotation : res.getFaceAnnotationsList()) {
      JSONObject jsonAnnotation = new JSONObject();
      jsonAnnotation.put("bounding_box", annotation.getBoundingPoly());
      jsonAnnotation.put("anger", annotation.getAngerLikelihoodValue());
      jsonAnnotation.put("blur", annotation.getBlurredLikelihoodValue());
      jsonAnnotation.put("joy", annotation.getJoyLikelihoodValue());
      jsonAnnotation.put("headwear", annotation.getHeadwearLikelihoodValue());
      jsonAnnotation.put("sorrow", annotation.getSorrowLikelihoodValue());
      jsonAnnotation.put("surprise", annotation.getSurpriseLikelihoodValue());
      jsonAnnotations.put(jsonAnnotation);
    }
    return jsonAnnotations;
  }

  private static JSONArray getLabelAnnotationsJson(AnnotateImageResponse res) {
    JSONArray jsonAnnotations = new JSONArray();
    for (EntityAnnotation annotation : res.getLabelAnnotationsList()) {
      JSONObject jsonAnnotation = new JSONObject();
      annotation
          .getAllFields()
          .forEach((k, v) -> jsonAnnotation.put(k.toString(), v.toString()));
      jsonAnnotations.put(jsonAnnotation);
    }
    return jsonAnnotations;
  }

  private static JSONArray getLandmarkAnnotationsJson(AnnotateImageResponse res) {
    JSONArray jsonAnnotations = new JSONArray();
    for (EntityAnnotation annotation : res.getLandmarkAnnotationsList()) {
      JSONObject jsonAnnotation = new JSONObject();
      LocationInfo info = annotation.getLocationsList().listIterator().next();
      jsonAnnotation.put("description", annotation.getDescription());
      jsonAnnotation.put("location", info.getLatLng());
      jsonAnnotations.put(jsonAnnotation);
    }
    return jsonAnnotations;
  }

  private static JSONArray getImagePropertiesJSON(AnnotateImageResponse res) {
    JSONArray jsonAnnotations = new JSONArray();
    DominantColorsAnnotation colors = res.getImagePropertiesAnnotation().getDominantColors();
    for (ColorInfo color : colors.getColorsList()) {
      JSONObject jsonAnnotation = new JSONObject();
      jsonAnnotation.put("fraction", color.getPixelFraction());
      jsonAnnotation.put("red", color.getColor().getRed());
      jsonAnnotation.put("green", color.getColor().getGreen());
      jsonAnnotation.put("blue", color.getColor().getBlue());
      jsonAnnotations.put(jsonAnnotation);
    }
    return jsonAnnotations;
  }

  private static JSONArray getLocalizedObjectsJSON(AnnotateImageResponse res) {
    JSONArray jsonAnnotations = new JSONArray();
    for (LocalizedObjectAnnotation entity : res.getLocalizedObjectAnnotationsList()) {
      JSONObject jsonAnnotation = new JSONObject();
      jsonAnnotation.put("name", entity.getName());
      jsonAnnotation.put("score", entity.getScore());
      JSONArray verticesJson = new JSONArray();
      entity
          .getBoundingPoly()
          .getNormalizedVerticesList()
          .forEach(vertex -> verticesJson.put(new JSONObject(
              new HashMap<String, Float>() {
                {
                  put("x", vertex.getX());
                  put("y", vertex.getY());
                }
              })));
      jsonAnnotation.put("vertices", verticesJson);
      jsonAnnotations.put(jsonAnnotation);
    }
    return jsonAnnotations;
  }

  /**
   * Calls Google Cloud Vision to provide annotations of features described in
   * SUPPORTED_TYPES.
   * @param imgData Byte array of the image to annotate.
   * @return A JSON Object containing the annotations produced by Google Cloud's
   * Vision API. For an example of the returned type of JSON, see
   * src/main/resources/times-square.json, which is the resultant JSON when
   * parsing the image times-square.jpg.
   */
  public static JSONObject getAnnotations(byte[] imgData) throws Exception {
    // Initialize client that will be used to send requests. This client only needs
    // to be created
    // once, and can be reused for multiple requests. After completing all of your
    // requests, call
    // the "close" method on the client to safely clean up any remaining background
    // resources.

    Credentials credentials = GoogleCredentials.fromStream(
        CloudVision.class.getClassLoader().getResourceAsStream("credentials.json"));
    ImageAnnotatorSettings settings = ImageAnnotatorSettings.newBuilder()
        .setCredentialsProvider(() -> credentials)
        .build();

    try (ImageAnnotatorClient vision = ImageAnnotatorClient.create(settings)) {
      ByteString imgBytes = ByteString.copyFrom(imgData);

      // Builds the image annotation request
      List<AnnotateImageRequest> requests = new ArrayList<>();
      Image img = Image.newBuilder().setContent(imgBytes).build();
      List<Feature> featureList = new LinkedList<>();
      for (Type t : SUPPORTED_TYPES) {
        Feature feat = Feature.newBuilder().setType(t).build();
        featureList.add(feat);
      }
      AnnotateImageRequest request = AnnotateImageRequest.newBuilder().addAllFeatures(featureList).setImage(img)
          .build();
      requests.add(request);

      // Performs label detection on the image file
      BatchAnnotateImagesResponse response = vision.batchAnnotateImages(requests);
      List<AnnotateImageResponse> responses = response.getResponsesList();

      JSONObject obj = new JSONObject();
      JSONObject jsonResponses = new JSONObject();

      AnnotateImageResponse res = responses.get(0);

      if (res.hasError()) {
        System.err.format("Error: %s%n", res.getError().getMessage());
        obj.put("error", res.getError().getMessage());
        return obj;
      }

      jsonResponses.put("TEXT_DETECTION", getTextAnnotationsJson(res));
      jsonResponses.put("FACE_DETECTION", getFaceAnnotationsJson(res));
      jsonResponses.put("LABEL_DETECTION", getLabelAnnotationsJson(res));
      jsonResponses.put("LANDMARK_DETECTION", getLandmarkAnnotationsJson(res));
      jsonResponses.put("IMAGE_PROPERTIES", getImagePropertiesJSON(res));
      jsonResponses.put("OBJECT_LOCALIZATION", getLocalizedObjectsJSON(res));

      obj.put("responses", jsonResponses);
      return obj;
    }
  }
}