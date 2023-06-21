package com.manati.squid.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Transaction.
 */
@Entity
@Table(name = "transaction")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Transaction implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "card_number")
    private String cardNumber;

    @Column(name = "cost")
    private Double cost;

    @ManyToOne
    private User source;

    @ManyToOne
    @JsonIgnoreProperties(value = { "location", "owner", "catalogs" }, allowSetters = true)
    private Business destination;

    @ManyToOne
    @JsonIgnoreProperties(value = { "vehicle", "operator", "status", "orderRating", "transactions", "files" }, allowSetters = true)
    private Order order;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Transaction id(Long id) {
        this.id = id;
        return this;
    }

    public String getCardNumber() {
        return this.cardNumber;
    }

    public Transaction cardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
        return this;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public Double getCost() {
        return this.cost;
    }

    public Transaction cost(Double cost) {
        this.cost = cost;
        return this;
    }

    public void setCost(Double cost) {
        this.cost = cost;
    }

    public User getSource() {
        return this.source;
    }

    public Transaction source(User user) {
        this.setSource(user);
        return this;
    }

    public void setSource(User user) {
        this.source = user;
    }

    public Business getDestination() {
        return this.destination;
    }

    public Transaction destination(Business business) {
        this.setDestination(business);
        return this;
    }

    public void setDestination(Business business) {
        this.destination = business;
    }

    public Order getOrder() {
        return this.order;
    }

    public Transaction order(Order order) {
        this.setOrder(order);
        return this;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Transaction)) {
            return false;
        }
        return id != null && id.equals(((Transaction) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Transaction{" +
            "id=" + getId() +
            ", cardNumber='" + getCardNumber() + "'" +
            ", cost=" + getCost() +
            "}";
    }
}
