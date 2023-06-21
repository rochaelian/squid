package com.manati.squid.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.manati.squid.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BusinessServiceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BusinessService.class);
        BusinessService businessService1 = new BusinessService();
        businessService1.setId(1L);
        BusinessService businessService2 = new BusinessService();
        businessService2.setId(businessService1.getId());
        assertThat(businessService1).isEqualTo(businessService2);
        businessService2.setId(2L);
        assertThat(businessService1).isNotEqualTo(businessService2);
        businessService1.setId(null);
        assertThat(businessService1).isNotEqualTo(businessService2);
    }
}
