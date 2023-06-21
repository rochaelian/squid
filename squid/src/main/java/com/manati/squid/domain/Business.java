package com.manati.squid.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.manati.squid.domain.enumeration.Status;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Business.
 */
@Entity
@Table(name = "business")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Business implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "identification")
    private String identification;

    @Column(name = "name")
    private String name;

    @Column(name = "tax_regime")
    private String taxRegime;

    @Column(name = "category")
    private String category;

    @Column(name = "rating")
    private Double rating;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Column(name = "capacity")
    private Integer capacity;

    @Column(name = "image")
    private String image;

    @OneToOne
    @JoinColumn(unique = true)
    private Location location;

    @ManyToOne
    private User owner;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JoinTable(
        name = "rel_business__catalog",
        joinColumns = @JoinColumn(name = "business_id"),
        inverseJoinColumns = @JoinColumn(name = "catalog_id")
    )
    @JsonIgnoreProperties(value = { "businesses" }, allowSetters = true)
    private Set<Catalog> catalogs = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Business id(Long id) {
        this.id = id;
        return this;
    }

    public String getIdentification() {
        return this.identification;
    }

    public Business identification(String identification) {
        this.identification = identification;
        return this;
    }

    public void setIdentification(String identification) {
        this.identification = identification;
    }

    public String getName() {
        return this.name;
    }

    public Business name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTaxRegime() {
        return this.taxRegime;
    }

    public Business taxRegime(String taxRegime) {
        this.taxRegime = taxRegime;
        return this;
    }

    public void setTaxRegime(String taxRegime) {
        this.taxRegime = taxRegime;
    }

    public String getCategory() {
        return this.category;
    }

    public Business category(String category) {
        this.category = category;
        return this;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getRating() {
        return this.rating;
    }

    public Business rating(Double rating) {
        this.rating = rating;
        return this;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Status getStatus() {
        return this.status;
    }

    public Business status(Status status) {
        this.status = status;
        return this;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Integer getCapacity() {
        return this.capacity;
    }

    public Business capacity(Integer capacity) {
        this.capacity = capacity;
        return this;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getImage() {
        return this.image;
    }

    public Business image(String image) {
        this.image = image;
        return this;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Location getLocation() {
        return this.location;
    }

    public Business location(Location location) {
        this.setLocation(location);
        return this;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public User getOwner() {
        return this.owner;
    }

    public Business owner(User user) {
        this.setOwner(user);
        return this;
    }

    public void setOwner(User user) {
        this.owner = user;
    }

    public Set<Catalog> getCatalogs() {
        return this.catalogs;
    }

    public Business catalogs(Set<Catalog> catalogs) {
        this.setCatalogs(catalogs);
        return this;
    }

    public Business addCatalog(Catalog catalog) {
        this.catalogs.add(catalog);
        catalog.getBusinesses().add(this);
        return this;
    }

    public Business removeCatalog(Catalog catalog) {
        this.catalogs.remove(catalog);
        catalog.getBusinesses().remove(this);
        return this;
    }

    public void setCatalogs(Set<Catalog> catalogs) {
        this.catalogs = catalogs;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Business)) {
            return false;
        }
        return id != null && id.equals(((Business) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Business{" +
            "id=" + getId() +
            ", identification='" + getIdentification() + "'" +
            ", name='" + getName() + "'" +
            ", taxRegime='" + getTaxRegime() + "'" +
            ", category='" + getCategory() + "'" +
            ", rating=" + getRating() +
            ", status='" + getStatus() + "'" +
            ", capacity=" + getCapacity() +
            ", image='" + getImage() + "'" +
            "}";
    }
}
