/**
 * Local Upload Data Plugin
 * 
 * This plugin allows users to upload their own images to run through the Google
 * Cloud Vision API
 */

package edu.cmu.cs214.hw6.plugin;

import java.util.Base64;
import java.util.List;

import edu.cmu.cs214.hw6.framework.DataPluginBackEnd;
import fi.iki.elonen.NanoHTTPD.IHTTPSession;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;

import fi.iki.elonen.NanoFileUpload;

public class Upload implements DataPluginBackEnd {
    private final String pluginName = "Upload Files";

    public String[] getImages(IHTTPSession session){
        try {
            List<FileItem> files = new NanoFileUpload(new DiskFileItemFactory()).parseRequest(session);
            String[] imgs = new String[ files.size() ];
            int i = 0;
            for (FileItem file : files) {
                try {
                    // String fileName = file.getName(); 
                    byte[] fileContent = file.get(); 
                    String base64 =  Base64.getEncoder().withoutPadding().encodeToString(fileContent);
                    imgs[i] = base64;
                    i++;
                } catch (Exception exception) {
                    System.err.println("Exception occurred when loading files in upload plugin");
                    return null;
                }
            }
            return imgs;
        } catch (Exception e) {
            System.err.println("Exception occurred in Upload Plugin");
        }

        return null;
    }

    public String getName(){
        return this.pluginName;
    }
}
