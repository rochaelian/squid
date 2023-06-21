package com.manati.squid.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.manati.squid.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SeoRecordTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SeoRecord.class);
        SeoRecord seoRecord1 = new SeoRecord();
        seoRecord1.setId(1L);
        SeoRecord seoRecord2 = new SeoRecord();
        seoRecord2.setId(seoRecord1.getId());
        assertThat(seoRecord1).isEqualTo(seoRecord2);
        seoRecord2.setId(2L);
        assertThat(seoRecord1).isNotEqualTo(seoRecord2);
        seoRecord1.setId(null);
        assertThat(seoRecord1).isNotEqualTo(seoRecord2);
    }
}
