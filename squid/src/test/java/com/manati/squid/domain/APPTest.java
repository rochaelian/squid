package com.manati.squid.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.manati.squid.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class APPTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(APP.class);
        APP aPP1 = new APP();
        aPP1.setId(1L);
        APP aPP2 = new APP();
        aPP2.setId(aPP1.getId());
        assertThat(aPP1).isEqualTo(aPP2);
        aPP2.setId(2L);
        assertThat(aPP1).isNotEqualTo(aPP2);
        aPP1.setId(null);
        assertThat(aPP1).isNotEqualTo(aPP2);
    }
}
