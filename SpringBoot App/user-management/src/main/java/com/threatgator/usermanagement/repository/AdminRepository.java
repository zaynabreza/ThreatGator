package com.threatgator.usermanagement.repository;

import org.springframework.stereotype.Repository;
import com.threatgator.usermanagement.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface AdminRepository extends JpaRepository<Admin,Integer> {
}
