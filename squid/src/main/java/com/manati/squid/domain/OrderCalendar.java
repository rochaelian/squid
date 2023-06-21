package com.manati.squid.domain;

import java.time.ZonedDateTime;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class OrderCalendar {

    @javax.persistence.Id
    private Long Id;

    private String Subject;

    private ZonedDateTime StartTime;

    private ZonedDateTime EndTime;

    private Boolean IsAllDay;

    private Boolean IsBlock;

    private Boolean IsReadonly;

    public OrderCalendar(
        Long id,
        String subject,
        ZonedDateTime startTime,
        ZonedDateTime endTime,
        Boolean isAllDay,
        Boolean isBlock,
        Boolean isReadonly
    ) {
        Id = id;
        Subject = subject;
        StartTime = startTime;
        EndTime = endTime;
        IsAllDay = isAllDay;
        IsBlock = isBlock;
        IsReadonly = isReadonly;
    }

    public OrderCalendar() {}

    public Long getId() {
        return Id;
    }

    public void setId(Long id) {
        Id = id;
    }

    public String getSubject() {
        return Subject;
    }

    public void setSubject(String subject) {
        Subject = subject;
    }

    public ZonedDateTime getStartTime() {
        return StartTime;
    }

    public void setStartTime(ZonedDateTime startTime) {
        StartTime = startTime;
    }

    public ZonedDateTime getEndTime() {
        return EndTime;
    }

    public void setEndTime(ZonedDateTime endTime) {
        EndTime = endTime;
    }

    public Boolean getAllDay() {
        return IsAllDay;
    }

    public void setAllDay(Boolean allDay) {
        IsAllDay = allDay;
    }

    public Boolean getBlock() {
        return IsBlock;
    }

    public void setBlock(Boolean block) {
        IsBlock = block;
    }

    public Boolean getReadonly() {
        return IsReadonly;
    }

    public void setReadonly(Boolean readonly) {
        IsReadonly = readonly;
    }
}
