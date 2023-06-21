package com.manati.squid.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.manati.squid.IntegrationTest;
import com.manati.squid.domain.OrderRating;
import com.manati.squid.repository.OrderRatingRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link OrderRatingResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OrderRatingResourceIT {

    private static final Integer DEFAULT_RATING = 1;
    private static final Integer UPDATED_RATING = 2;

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/order-ratings";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OrderRatingRepository orderRatingRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOrderRatingMockMvc;

    private OrderRating orderRating;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrderRating createEntity(EntityManager em) {
        OrderRating orderRating = new OrderRating().rating(DEFAULT_RATING).comment(DEFAULT_COMMENT);
        return orderRating;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrderRating createUpdatedEntity(EntityManager em) {
        OrderRating orderRating = new OrderRating().rating(UPDATED_RATING).comment(UPDATED_COMMENT);
        return orderRating;
    }

    @BeforeEach
    public void initTest() {
        orderRating = createEntity(em);
    }

    @Test
    @Transactional
    void createOrderRating() throws Exception {
        int databaseSizeBeforeCreate = orderRatingRepository.findAll().size();
        // Create the OrderRating
        restOrderRatingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orderRating)))
            .andExpect(status().isCreated());

        // Validate the OrderRating in the database
        List<OrderRating> orderRatingList = orderRatingRepository.findAll();
        assertThat(orderRatingList).hasSize(databaseSizeBeforeCreate + 1);
        OrderRating testOrderRating = orderRatingList.get(orderRatingList.size() - 1);
        assertThat(testOrderRating.getRating()).isEqualTo(DEFAULT_RATING);
        assertThat(testOrderRating.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void createOrderRatingWithExistingId() throws Exception {
        // Create the OrderRating with an existing ID
        orderRating.setId(1L);

        int databaseSizeBeforeCreate = orderRatingRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrderRatingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orderRating)))
            .andExpect(status().isBadRequest());

        // Validate the OrderRating in the database
        List<OrderRating> orderRatingList = orderRatingRepository.findAll();
        assertThat(orderRatingList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllOrderRatings() throws Exception {
        // Initialize the database
        orderRatingRepository.saveAndFlush(orderRating);

        // Get all the orderRatingList
        restOrderRatingMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(orderRating.getId().intValue())))
            .andExpect(jsonPath("$.[*].rating").value(hasItem(DEFAULT_RATING)))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)));
    }

    @Test
    @Transactional
    void getOrderRating() throws Exception {
        // Initialize the database
        orderRatingRepository.saveAndFlush(orderRating);

        // Get the orderRating
        restOrderRatingMockMvc
            .perform(get(ENTITY_API_URL_ID, orderRating.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(orderRating.getId().intValue()))
            .andExpect(jsonPath("$.rating").value(DEFAULT_RATING))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT));
    }

    @Test
    @Transactional
    void getNonExistingOrderRating() throws Exception {
        // Get the orderRating
        restOrderRatingMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewOrderRating() throws Exception {
        // Initialize the database
        orderRatingRepository.saveAndFlush(orderRating);

        int databaseSizeBeforeUpdate = orderRatingRepository.findAll().size();

        // Update the orderRating
        OrderRating updatedOrderRating = orderRatingRepository.findById(orderRating.getId()).get();
        // Disconnect from session so that the updates on updatedOrderRating are not directly saved in db
        em.detach(updatedOrderRating);
        updatedOrderRating.rating(UPDATED_RATING).comment(UPDATED_COMMENT);

        restOrderRatingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOrderRating.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOrderRating))
            )
            .andExpect(status().isOk());

        // Validate the OrderRating in the database
        List<OrderRating> orderRatingList = orderRatingRepository.findAll();
        assertThat(orderRatingList).hasSize(databaseSizeBeforeUpdate);
        OrderRating testOrderRating = orderRatingList.get(orderRatingList.size() - 1);
        assertThat(testOrderRating.getRating()).isEqualTo(UPDATED_RATING);
        assertThat(testOrderRating.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void putNonExistingOrderRating() throws Exception {
        int databaseSizeBeforeUpdate = orderRatingRepository.findAll().size();
        orderRating.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrderRatingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, orderRating.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(orderRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderRating in the database
        List<OrderRating> orderRatingList = orderRatingRepository.findAll();
        assertThat(orderRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOrderRating() throws Exception {
        int databaseSizeBeforeUpdate = orderRatingRepository.findAll().size();
        orderRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderRatingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(orderRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderRating in the database
        List<OrderRating> orderRatingList = orderRatingRepository.findAll();
        assertThat(orderRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOrderRating() throws Exception {
        int databaseSizeBeforeUpdate = orderRatingRepository.findAll().size();
        orderRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderRatingMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orderRating)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrderRating in the database
        List<OrderRating> orderRatingList = orderRatingRepository.findAll();
        assertThat(orderRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOrderRatingWithPatch() throws Exception {
        // Initialize the database
        orderRatingRepository.saveAndFlush(orderRating);

        int databaseSizeBeforeUpdate = orderRatingRepository.findAll().size();

        // Update the orderRating using partial update
        OrderRating partialUpdatedOrderRating = new OrderRating();
        partialUpdatedOrderRating.setId(orderRating.getId());

        partialUpdatedOrderRating.rating(UPDATED_RATING).comment(UPDATED_COMMENT);

        restOrderRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrderRating.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrderRating))
            )
            .andExpect(status().isOk());

        // Validate the OrderRating in the database
        List<OrderRating> orderRatingList = orderRatingRepository.findAll();
        assertThat(orderRatingList).hasSize(databaseSizeBeforeUpdate);
        OrderRating testOrderRating = orderRatingList.get(orderRatingList.size() - 1);
        assertThat(testOrderRating.getRating()).isEqualTo(UPDATED_RATING);
        assertThat(testOrderRating.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void fullUpdateOrderRatingWithPatch() throws Exception {
        // Initialize the database
        orderRatingRepository.saveAndFlush(orderRating);

        int databaseSizeBeforeUpdate = orderRatingRepository.findAll().size();

        // Update the orderRating using partial update
        OrderRating partialUpdatedOrderRating = new OrderRating();
        partialUpdatedOrderRating.setId(orderRating.getId());

        partialUpdatedOrderRating.rating(UPDATED_RATING).comment(UPDATED_COMMENT);

        restOrderRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrderRating.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrderRating))
            )
            .andExpect(status().isOk());

        // Validate the OrderRating in the database
        List<OrderRating> orderRatingList = orderRatingRepository.findAll();
        assertThat(orderRatingList).hasSize(databaseSizeBeforeUpdate);
        OrderRating testOrderRating = orderRatingList.get(orderRatingList.size() - 1);
        assertThat(testOrderRating.getRating()).isEqualTo(UPDATED_RATING);
        assertThat(testOrderRating.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void patchNonExistingOrderRating() throws Exception {
        int databaseSizeBeforeUpdate = orderRatingRepository.findAll().size();
        orderRating.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrderRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, orderRating.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(orderRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderRating in the database
        List<OrderRating> orderRatingList = orderRatingRepository.findAll();
        assertThat(orderRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOrderRating() throws Exception {
        int databaseSizeBeforeUpdate = orderRatingRepository.findAll().size();
        orderRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(orderRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderRating in the database
        List<OrderRating> orderRatingList = orderRatingRepository.findAll();
        assertThat(orderRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOrderRating() throws Exception {
        int databaseSizeBeforeUpdate = orderRatingRepository.findAll().size();
        orderRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderRatingMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(orderRating))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrderRating in the database
        List<OrderRating> orderRatingList = orderRatingRepository.findAll();
        assertThat(orderRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOrderRating() throws Exception {
        // Initialize the database
        orderRatingRepository.saveAndFlush(orderRating);

        int databaseSizeBeforeDelete = orderRatingRepository.findAll().size();

        // Delete the orderRating
        restOrderRatingMockMvc
            .perform(delete(ENTITY_API_URL_ID, orderRating.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<OrderRating> orderRatingList = orderRatingRepository.findAll();
        assertThat(orderRatingList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
