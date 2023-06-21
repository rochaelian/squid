package com.manati.squid.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Location.
 */
@Entity
@Table(name = "location")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Location implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "province")
    private String province;

    @Column(name = "canton")
    private String canton;

    @Column(name = "district")
    private String district;

    @Column(name = "latitud")
    private String latitud;

    @Column(name = "longitude")
    private String longitude;

    @Column(name = "exact_location")
    private String exactLocation;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Location id(Long id) {
        this.id = id;
        return this;
    }

    public String getProvince() {
        return this.province;
    }

    public Location province(String province) {
        this.province = province;
        return this;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getCanton() {
        return this.canton;
    }

    public Location canton(String canton) {
        this.canton = canton;
        return this;
    }

    public void setCanton(String canton) {
        this.canton = canton;
    }

    public String getDistrict() {
        return this.district;
    }

    public Location district(String district) {
        this.district = district;
        return this;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getLatitud() {
        return this.latitud;
    }

    public Location latitud(String latitud) {
        this.latitud = latitud;
        return this;
    }

    public void setLatitud(String latitud) {
        this.latitud = latitud;
    }

    public String getLongitude() {
        return this.longitude;
    }

    public Location longitude(String longitude) {
        this.longitude = longitude;
        return this;
    }

    public void setLongitude(String longitude) {
        this.longitude = longitude;
    }

    public String getExactLocation() {
        return this.exactLocation;
    }

    public Location exactLocation(String exactLocation) {
        this.exactLocation = exactLocation;
        return this;
    }

    public void setExactLocation(String exactLocation) {
        this.exactLocation = exactLocation;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Location)) {
            return false;
        }
        return id != null && id.equals(((Location) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Location{" +
            "id=" + getId() +
            ", province='" + getProvince() + "'" +
            ", canton='" + getCanton() + "'" +
            ", district='" + getDistrict() + "'" +
            ", latitud='" + getLatitud() + "'" +
            ", longitude='" + getLongitude() + "'" +
            ", exactLocation='" + getExactLocation() + "'" +
            "}";
    }
}
