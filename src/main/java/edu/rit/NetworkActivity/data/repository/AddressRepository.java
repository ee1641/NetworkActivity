package edu.rit.NetworkActivity.data.repository;

import edu.rit.NetworkActivity.data.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {

    Optional<Address> findByAddress(String address);

    Optional<Address> findByAddressIgnoreCase(String address);

    @Query("""
        select a from Address a
        where lower(a.address) like lower(concat('%', :query, '%'))
           or lower(coalesce(a.type, '')) like lower(concat('%', :query, '%'))
    """)
    List<Address> searchAddresses(String query);
}