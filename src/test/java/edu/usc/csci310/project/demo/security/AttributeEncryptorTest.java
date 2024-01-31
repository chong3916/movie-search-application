package edu.usc.csci310.project.demo.security;

import com.beust.ah.A;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.InvalidArgumentException;
import org.w3c.dom.Attr;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

import java.security.Key;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

public class AttributeEncryptorTest {

    @Test
    public void convertToDatabaseColumnTestSuccess() throws Exception {
        AttributeEncryptor encryptor = new AttributeEncryptor();
        String result = encryptor.convertToDatabaseColumn("test");
        assertEquals("uHLGOFVkhKTZjl2SUkdkMw==", result);
    }

    @Test
    public void convertToDatabaseColumnTestFail() throws Exception {
        Cipher mockCipher = mock(Cipher.class);
        doThrow(new InvalidArgumentException("")).when(mockCipher).init(anyInt(), (Key) any());
        AttributeEncryptor encryptor = new AttributeEncryptor(null, mockCipher);
        assertThrows(IllegalStateException.class, () -> encryptor.convertToDatabaseColumn("test"));
    }

    @Test
    public void convertToEntityAttributeSuccess() throws Exception {
        AttributeEncryptor encryptor = new AttributeEncryptor();
        String result = encryptor.convertToEntityAttribute("uHLGOFVkhKTZjl2SUkdkMw==");
        assertEquals("test", result);
    }

    @Test
    public void convertToEntityAttributeFail() throws Exception {
        Cipher mockCipher = mock(Cipher.class);
        doThrow(new InvalidArgumentException("")).when(mockCipher).init(anyInt(), (Key) any());
        AttributeEncryptor encryptor = new AttributeEncryptor(null, mockCipher);
        assertThrows(IllegalStateException.class, () -> encryptor.convertToEntityAttribute("test"));
    }
}
