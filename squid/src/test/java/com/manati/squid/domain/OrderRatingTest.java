package com.manati.squid.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.manati.squid.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OrderRatingTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OrderRating.class);
        OrderRating orderRating1 = new OrderRating();
        orderRating1.setId(1L);
        OrderRating orderRating2 = new OrderRating();
        orderRating2.setId(orderRating1.getId());
        assertThat(orderRating1).isEqualTo(orderRating2);
        orderRating2.setId(2L);
        assertThat(orderRating1).isNotEqualTo(orderRating2);
        orderRating1.setId(null);
        assertThat(orderRating1).isNotEqualTo(orderRating2);
    }
}
