package edu.rit.NetworkActivity.data.repository;

import edu.rit.NetworkActivity.data.entity.Label;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface LabelRepository extends JpaRepository<Label, Long> {

    Optional<Label> findByAddress(String address);

    List<Label> findByAddressIn(List<String> addresses);

    Optional<Label> findByAddressIgnoreCase(String address);

    List<Label> findByCategory(String category);

    List<Label> findByTargetAddress(String targetAddress);

    List<Label> findByCategoryIgnoreCase(String category);

    List<Label> findBySourceIgnoreCase(String source);

    List<Label> findByEntityNameContainingIgnoreCase(String entityName);

    @Query("""
        select l from Label l
        where lower(coalesce(l.labelName, '')) like lower(concat('%', :query, '%'))
           or lower(coalesce(l.entityName, '')) like lower(concat('%', :query, '%'))
           or lower(coalesce(l.category, '')) like lower(concat('%', :query, '%'))
           or lower(coalesce(l.source, '')) like lower(concat('%', :query, '%'))
           or lower(coalesce(l.address, '')) like lower(concat('%', :query, '%'))
        order by l.labelName asc
    """)
    List<Label> searchLabels(String query);
}