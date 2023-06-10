/**
 * Web Scraper Data Plugin
 * 
 * This data plugin will scrape a given URL for up to MAX_IMAGES images
 * with the <img> tag. The front-end data plugin will provide a URL to the back-end
 * to scrape.
 * 
 * This plugin is contingent on the images being publicly available and resourced.
 * Any images that are not accessible are excluded from being scraped.
 */

package edu.cmu.cs214.hw6.plugin;

import java.util.Base64;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import edu.cmu.cs214.hw6.framework.DataPluginBackEnd;

import fi.iki.elonen.NanoHTTPD.IHTTPSession;

public class Scraper implements DataPluginBackEnd {
    private final String pluginName = "Web Scraper";
    private static final int MAX_IMAGES = 10;

    private static List<String> scrapeImageURLs(String url) {
        List<String> imgURLs = new LinkedList<String>();
        try {
            System.err.println(url);
            Document document = Jsoup.connect(url).get();
            Elements imgElements = document.getElementsByTag("img");
            for (Element img : imgElements) {
                String imgUrl = img.absUrl("src");
                if (imgUrl != null && imgUrl.length() > 0) {
                    imgURLs.add(imgUrl);
                }
            }  
            return imgURLs;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private static byte[] getRawFromSrc(String url) {
        try {
            HttpClient httpClient = HttpClients.createDefault();
            HttpGet request = new HttpGet(url);
            byte[] bytes = httpClient.execute(request, response -> EntityUtils.toByteArray(response.getEntity()));
            return bytes;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public String[] getImages(IHTTPSession session){
        try {
            Map<String, String> input = new HashMap<String, String>();
            session.parseBody(new HashMap<String, String>());
            input = session.getParms();
            String url = input.get("url");

            List<String> imageUrls = scrapeImageURLs(url);
            List<String> base64Images = new LinkedList<>();
            for (String imageUrl : imageUrls) {
                byte[] rawImg = getRawFromSrc(imageUrl);
                if (rawImg != null) {
                    String base64 = Base64.getEncoder().withoutPadding().encodeToString(rawImg);
                    base64Images.add(base64);
                    if (base64Images.size() >= MAX_IMAGES) {
                        break;
                    }
                }
            }
           
            String[] res = base64Images.toArray(new String[0]);
            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return new String[0];
        }
    }

    public String getName(){
        return this.pluginName;
    }
}
