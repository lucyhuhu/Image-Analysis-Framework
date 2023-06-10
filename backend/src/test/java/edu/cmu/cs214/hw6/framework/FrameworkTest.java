package edu.cmu.cs214.hw6.framework;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertFalse;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import org.junit.Before;
import org.junit.Test;

import edu.cmu.cs214.hw6.plugin.Upload;
import fi.iki.elonen.NanoHTTPD.IHTTPSession;

public class FrameworkTest {
    private DataFrameworkImpl framework;
    private DataPluginBackEnd dataPlugin;

    @Before
    public void setUp() {
        framework = new DataFrameworkImpl();
        dataPlugin = new Upload();
        framework.registerPlugin(dataPlugin);
    }

    @Test
    public void testSetActivePlugin() {
        assertTrue(framework.setActivePlugin(dataPlugin.getName()));
    }

    @Test
    public void testSetActivePlugin1() {
        assertFalse(framework.setActivePlugin("InvalidName"));
    }

    @Test
    public void testGetActivePlugin() {
        assertTrue(framework.setActivePlugin(dataPlugin.getName()));
        assertEquals(dataPlugin, framework.getActivePlugin());
    }

    @Test
    public void testMockFramework() {
        DataFrameworkImpl mockFramework = mock(DataFrameworkImpl.class);
        IHTTPSession mockSession = mock(IHTTPSession.class);
        mockFramework.registerPlugin(dataPlugin);
        mockFramework.setActivePlugin(dataPlugin.getName());
        mockFramework.getActivePlugin();
        mockFramework.getImageAnnotations(mockSession);
        mockFramework.getImageStrings();
        verify(mockFramework, times(1)).registerPlugin(dataPlugin);
        verify(mockFramework, times(1)).setActivePlugin(dataPlugin.getName());
        verify(mockFramework, times(1)).getActivePlugin();
        verify(mockFramework, times(1)).getImageStrings();
        verify(mockFramework, times(1)).getImageAnnotations(mockSession);
    }
}
