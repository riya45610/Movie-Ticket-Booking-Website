
package com.bms.demo.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.bms.demo.model.Booking;

public interface BookingRepository extends JpaRepository<Booking,Long>{}
