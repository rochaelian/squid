package com.manati.squid.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.manati.squid.domain.enumeration.Status;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Vehicle.
 */
@Entity
@Table(name = "vehicle")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Vehicle implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "plate")
    private String plate;

    @Column(name = "year")
    private String year;

    @Column(name = "r_tv")
    private LocalDate rTV;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @ManyToOne
    private User user;

    @ManyToOne
    @JsonIgnoreProperties(value = { "businesses" }, allowSetters = true)
    private Catalog insurer;

    @ManyToOne
    @JsonIgnoreProperties(value = { "businesses" }, allowSetters = true)
    private Catalog motorType;

    @ManyToOne
    @JsonIgnoreProperties(value = { "businesses" }, allowSetters = true)
    private Catalog vehicleType;

    @ManyToOne
    @JsonIgnoreProperties(value = { "businesses" }, allowSetters = true)
    private Catalog brand;

    @OneToMany(mappedBy = "vehicle")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "vehicle", "operator", "status", "orderRating", "transactions", "files" }, allowSetters = true)
    private Set<Order> orders = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Vehicle id(Long id) {
        this.id = id;
        return this;
    }

    public String getPlate() {
        return this.plate;
    }

    public Vehicle plate(String plate) {
        this.plate = plate;
        return this;
    }

    public void setPlate(String plate) {
        this.plate = plate;
    }

    public String getYear() {
        return this.year;
    }

    public Vehicle year(String year) {
        this.year = year;
        return this;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public LocalDate getrTV() {
        return this.rTV;
    }

    public Vehicle rTV(LocalDate rTV) {
        this.rTV = rTV;
        return this;
    }

    public void setrTV(LocalDate rTV) {
        this.rTV = rTV;
    }

    public Status getStatus() {
        return this.status;
    }

    public Vehicle status(Status status) {
        this.status = status;
        return this;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public User getUser() {
        return this.user;
    }

    public Vehicle user(User user) {
        this.setUser(user);
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Catalog getInsurer() {
        return this.insurer;
    }

    public Vehicle insurer(Catalog catalog) {
        this.setInsurer(catalog);
        return this;
    }

    public void setInsurer(Catalog catalog) {
        this.insurer = catalog;
    }

    public Catalog getMotorType() {
        return this.motorType;
    }

    public Vehicle motorType(Catalog catalog) {
        this.setMotorType(catalog);
        return this;
    }

    public void setMotorType(Catalog catalog) {
        this.motorType = catalog;
    }

    public Catalog getVehicleType() {
        return this.vehicleType;
    }

    public Vehicle vehicleType(Catalog catalog) {
        this.setVehicleType(catalog);
        return this;
    }

    public void setVehicleType(Catalog catalog) {
        this.vehicleType = catalog;
    }

    public Catalog getBrand() {
        return this.brand;
    }

    public Vehicle brand(Catalog catalog) {
        this.setBrand(catalog);
        return this;
    }

    public void setBrand(Catalog catalog) {
        this.brand = catalog;
    }

    public Set<Order> getOrders() {
        return this.orders;
    }

    public Vehicle orders(Set<Order> orders) {
        this.setOrders(orders);
        return this;
    }

    public Vehicle addOrder(Order order) {
        this.orders.add(order);
        order.setVehicle(this);
        return this;
    }

    public Vehicle removeOrder(Order order) {
        this.orders.remove(order);
        order.setVehicle(null);
        return this;
    }

    public void setOrders(Set<Order> orders) {
        if (this.orders != null) {
            this.orders.forEach(i -> i.setVehicle(null));
        }
        if (orders != null) {
            orders.forEach(i -> i.setVehicle(this));
        }
        this.orders = orders;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Vehicle)) {
            return false;
        }
        return id != null && id.equals(((Vehicle) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Vehicle{" +
            "id=" + getId() +
            ", plate='" + getPlate() + "'" +
            ", year='" + getYear() + "'" +
            ", rTV='" + getrTV() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
