package com.manati.squid.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Schedule.
 */
@Entity
@Table(name = "schedule")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Schedule implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "day")
    private String day;

    @Column(name = "start_time")
    private ZonedDateTime startTime;

    @Column(name = "end_time")
    private ZonedDateTime endTime;

    @Column(name = "is_special")
    private Boolean isSpecial;

    @Column(name = "special_date")
    private LocalDate specialDate;

    @ManyToOne
    @JsonIgnoreProperties(value = { "location", "owner", "catalogs" }, allowSetters = true)
    private Business business;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Schedule id(Long id) {
        this.id = id;
        return this;
    }

    public String getDay() {
        return this.day;
    }

    public Schedule day(String day) {
        this.day = day;
        return this;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public ZonedDateTime getStartTime() {
        return this.startTime;
    }

    public Schedule startTime(ZonedDateTime startTime) {
        this.startTime = startTime;
        return this;
    }

    public void setStartTime(ZonedDateTime startTime) {
        this.startTime = startTime;
    }

    public ZonedDateTime getEndTime() {
        return this.endTime;
    }

    public Schedule endTime(ZonedDateTime endTime) {
        this.endTime = endTime;
        return this;
    }

    public void setEndTime(ZonedDateTime endTime) {
        this.endTime = endTime;
    }

    public Boolean getIsSpecial() {
        return this.isSpecial;
    }

    public Schedule isSpecial(Boolean isSpecial) {
        this.isSpecial = isSpecial;
        return this;
    }

    public void setIsSpecial(Boolean isSpecial) {
        this.isSpecial = isSpecial;
    }

    public LocalDate getSpecialDate() {
        return this.specialDate;
    }

    public Schedule specialDate(LocalDate specialDate) {
        this.specialDate = specialDate;
        return this;
    }

    public void setSpecialDate(LocalDate specialDate) {
        this.specialDate = specialDate;
    }

    public Business getBusiness() {
        return this.business;
    }

    public Schedule business(Business business) {
        this.setBusiness(business);
        return this;
    }

    public void setBusiness(Business business) {
        this.business = business;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Schedule)) {
            return false;
        }
        return id != null && id.equals(((Schedule) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Schedule{" +
            "id=" + getId() +
            ", day='" + getDay() + "'" +
            ", startTime='" + getStartTime() + "'" +
            ", endTime='" + getEndTime() + "'" +
            ", isSpecial='" + getIsSpecial() + "'" +
            ", specialDate='" + getSpecialDate() + "'" +
            "}";
    }
}
