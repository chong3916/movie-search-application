package edu.usc.csci310.project.demo.security;

import jakarta.persistence.AttributeConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import javax.management.Attribute;
import java.security.Key;
import java.util.Base64;

@Component
public class AttributeEncryptor implements AttributeConverter<String, String> {


    private String secret = "test-key-1234567";

    private Key key;
    private Cipher cipher;

    public AttributeEncryptor() throws Exception {
        key = new SecretKeySpec(secret.getBytes(), "AES");
        cipher = Cipher.getInstance("AES");
    }

    public AttributeEncryptor(Key key, Cipher cipher) {
        this.key = key;
        this.cipher = cipher;
    }

    @Override
    public String convertToDatabaseColumn(String s) {
        try {
            cipher.init(Cipher.ENCRYPT_MODE, key);
            return Base64.getEncoder().encodeToString(cipher.doFinal(s.getBytes()));
        }
        catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    @Override
    public String convertToEntityAttribute(String s) {
        try {
            cipher.init(Cipher.DECRYPT_MODE, key);
            return new String(cipher.doFinal(Base64.getDecoder().decode(s)));
        }
        catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }
}
