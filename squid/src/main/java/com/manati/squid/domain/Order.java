package com.manati.squid.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Order.
 */
@Entity
@Table(name = "jhi_order")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Order implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "start_date")
    private ZonedDateTime startDate;

    @Column(name = "end_date")
    private ZonedDateTime endDate;

    @Column(name = "total_cost")
    private Double totalCost;

    @Column(name = "comission")
    private Double comission;

    @ManyToOne
    @JsonIgnoreProperties(value = { "orders" }, allowSetters = true)
    private Vehicle vehicle;

    @ManyToOne
    private User operator;

    @ManyToOne
    @JsonIgnoreProperties(value = { "location", "owner", "catalogs" }, allowSetters = true)
    private Business business;

    @ManyToOne
    @JsonIgnoreProperties(value = { "businesses" }, allowSetters = true)
    private Catalog status;

    @JsonIgnoreProperties(value = { "order" }, allowSetters = true)
    @OneToOne(mappedBy = "order")
    private OrderRating orderRating;

    @OneToMany(mappedBy = "order")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "source", "destination", "order" }, allowSetters = true)
    private Set<Transaction> transactions = new HashSet<>();

    @OneToMany(mappedBy = "order")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "order", "serviceOrder" }, allowSetters = true)
    private Set<File> files = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Order id(Long id) {
        this.id = id;
        return this;
    }

    public ZonedDateTime getStartDate() {
        return this.startDate;
    }

    public Order startDate(ZonedDateTime startDate) {
        this.startDate = startDate;
        return this;
    }

    public void setStartDate(ZonedDateTime startDate) {
        this.startDate = startDate;
    }

    public ZonedDateTime getEndDate() {
        return this.endDate;
    }

    public Order endDate(ZonedDateTime endDate) {
        this.endDate = endDate;
        return this;
    }

    public void setEndDate(ZonedDateTime endDate) {
        this.endDate = endDate;
    }

    public Double getTotalCost() {
        return this.totalCost;
    }

    public Order totalCost(Double totalCost) {
        this.totalCost = totalCost;
        return this;
    }

    public void setTotalCost(Double totalCost) {
        this.totalCost = totalCost;
    }

    public Double getComission() {
        return this.comission;
    }

    public Order comission(Double comission) {
        this.comission = comission;
        return this;
    }

    public void setComission(Double comission) {
        this.comission = comission;
    }

    public Vehicle getVehicle() {
        return this.vehicle;
    }

    public Order vehicle(Vehicle vehicle) {
        this.setVehicle(vehicle);
        return this;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public User getOperator() {
        return this.operator;
    }

    public Order operator(User user) {
        this.setOperator(user);
        return this;
    }

    public void setOperator(User user) {
        this.operator = user;
    }

    public Business getBusiness() {
        return this.business;
    }

    public Order business(Business business) {
        this.setBusiness(business);
        return this;
    }

    public void setBusiness(Business business) {
        this.business = business;
    }

    public Catalog getStatus() {
        return this.status;
    }

    public Order status(Catalog catalog) {
        this.setStatus(catalog);
        return this;
    }

    public void setStatus(Catalog catalog) {
        this.status = catalog;
    }

    public OrderRating getOrderRating() {
        return this.orderRating;
    }

    public Order orderRating(OrderRating orderRating) {
        this.setOrderRating(orderRating);
        return this;
    }

    public void setOrderRating(OrderRating orderRating) {
        if (this.orderRating != null) {
            this.orderRating.setOrder(null);
        }
        if (orderRating != null) {
            orderRating.setOrder(this);
        }
        this.orderRating = orderRating;
    }

    public Set<Transaction> getTransactions() {
        return this.transactions;
    }

    public Order transactions(Set<Transaction> transactions) {
        this.setTransactions(transactions);
        return this;
    }

    public Order addTransaction(Transaction transaction) {
        this.transactions.add(transaction);
        transaction.setOrder(this);
        return this;
    }

    public Order removeTransaction(Transaction transaction) {
        this.transactions.remove(transaction);
        transaction.setOrder(null);
        return this;
    }

    public void setTransactions(Set<Transaction> transactions) {
        if (this.transactions != null) {
            this.transactions.forEach(i -> i.setOrder(null));
        }
        if (transactions != null) {
            transactions.forEach(i -> i.setOrder(this));
        }
        this.transactions = transactions;
    }

    public Set<File> getFiles() {
        return this.files;
    }

    public Order files(Set<File> files) {
        this.setFiles(files);
        return this;
    }

    public Order addFile(File file) {
        this.files.add(file);
        file.setOrder(this);
        return this;
    }

    public Order removeFile(File file) {
        this.files.remove(file);
        file.setOrder(null);
        return this;
    }

    public void setFiles(Set<File> files) {
        if (this.files != null) {
            this.files.forEach(i -> i.setOrder(null));
        }
        if (files != null) {
            files.forEach(i -> i.setOrder(this));
        }
        this.files = files;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Order)) {
            return false;
        }
        return id != null && id.equals(((Order) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Order{" +
            "id=" + getId() +
            ", startDate='" + getStartDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            ", totalCost=" + getTotalCost() +
            ", comission=" + getComission() +
            "}";
    }
}
