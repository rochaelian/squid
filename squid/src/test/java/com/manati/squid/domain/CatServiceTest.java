package com.manati.squid.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.manati.squid.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CatServiceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CatService.class);
        CatService catService1 = new CatService();
        catService1.setId(1L);
        CatService catService2 = new CatService();
        catService2.setId(catService1.getId());
        assertThat(catService1).isEqualTo(catService2);
        catService2.setId(2L);
        assertThat(catService1).isNotEqualTo(catService2);
        catService1.setId(null);
        assertThat(catService1).isNotEqualTo(catService2);
    }
}
