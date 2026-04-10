package edu.rit.NetworkActivity.service;

import edu.rit.NetworkActivity.data.entity.Label;
import edu.rit.NetworkActivity.data.entity.Transaction;
import edu.rit.NetworkActivity.data.repository.LabelRepository;
import edu.rit.NetworkActivity.data.repository.TransactionRepository;
import edu.rit.NetworkActivity.service.dto.FlowAddressSummaryDto;
import edu.rit.NetworkActivity.service.dto.FlowAggregateDto;
import edu.rit.NetworkActivity.service.dto.HotspotDto;
import edu.rit.NetworkActivity.service.dto.HotspotPageDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FlowServiceTest {

        @Mock
        TransactionRepository transactionRepository;
        @Mock
        LabelRepository labelRepository;
        @InjectMocks
        FlowService flowService;

        private static final OffsetDateTime START = OffsetDateTime.of(2025, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC);
        private static final OffsetDateTime END = OffsetDateTime.of(2025, 1, 2, 0, 0, 0, 0, ZoneOffset.UTC);
        private static final OffsetDateTime PRIOR_START = START.minusDays(1);

        private Transaction tx(Long id, String from, String to, Float value, Float gas) {
                Transaction tx = new Transaction();
                tx.setId(id);
                tx.setFromAddress(from);
                tx.setToAddress(to);
                tx.setValue(value);
                tx.setGasFee(gas);
                tx.setTimestamp(START.plusHours(id));
                return tx;
        }

        @Test
        void getAggregate_calculatesMetricsCorrectly() {
                Transaction t1 = tx(1L, "0xAAA", "0xBBB", 10.0f, 0.5f);
                Transaction t2 = tx(2L, "0xAAA", "0xCCC", 20.0f, 1.0f);
                Transaction t3 = tx(3L, "0xDDD", "0xBBB", 5.0f, 0.2f);

                when(transactionRepository.findByTimestampBetween(START, END))
                                .thenReturn(List.of(t1, t2, t3));

                FlowAggregateDto dto = flowService.getAggregate(START, END, null, null, null);

                assertEquals(3, dto.getTransactionCount());
                assertEquals(35.0, dto.getTotalTransferredValue(), 0.01);
                assertEquals(1.7, dto.getTotalGasFees(), 0.01);
                assertEquals(2, dto.getUniqueSenders());
                assertEquals(2, dto.getUniqueReceivers());
        }

        @Test
        void getAggregate_filtersToAddressWhenProvided() {
                Transaction t1 = tx(1L, "0xAAA", "0xBBB", 10.0f, 0.5f);
                Transaction t2 = tx(2L, "0xBBB", "0xCCC", 20.0f, 1.0f);

                when(transactionRepository.findByFromAddressAndTimestampBetween("0xBBB", START, END))
                                .thenReturn(List.of(t2));
                when(transactionRepository.findByToAddressAndTimestampBetween("0xBBB", START, END))
                                .thenReturn(List.of(t1));

                FlowAggregateDto dto = flowService.getAggregate(START, END, "0xBBB", null, null);

                assertEquals(2, dto.getTransactionCount());
                assertEquals(30.0, dto.getTotalTransferredValue(), 0.01);
        }

        @Test
        void getAggregate_handlesNullValues() {
                Transaction t1 = tx(1L, "0xAAA", "0xBBB", null, null);

                when(transactionRepository.findByTimestampBetween(START, END))
                                .thenReturn(List.of(t1));

                FlowAggregateDto dto = flowService.getAggregate(START, END, null, null, null);

                assertEquals(1, dto.getTransactionCount());
                assertEquals(0.0, dto.getTotalTransferredValue(), 0.01);
                assertEquals(0.0, dto.getTotalGasFees(), 0.01);
        }

        @Test
        void getAggregate_emptyTransactionsReturnsZeros() {
                when(transactionRepository.findByTimestampBetween(START, END))
                                .thenReturn(List.of());

                FlowAggregateDto dto = flowService.getAggregate(START, END, null, null, null);

                assertEquals(0, dto.getTransactionCount());
                assertEquals(0.0, dto.getTotalTransferredValue(), 0.01);
                assertEquals(0, dto.getUniqueSenders());
                assertEquals(0, dto.getUniqueReceivers());
        }

        @Test
        void getAggregate_topSendersAreSortedDescending() {
                Transaction t1 = tx(1L, "0xLOW", "0xABC", 5.0f, 0.1f);
                Transaction t2 = tx(2L, "0xHIGH", "0xABC", 50.0f, 0.2f);

                when(transactionRepository.findByTimestampBetween(START, END))
                                .thenReturn(List.of(t1, t2));

                FlowAggregateDto dto = flowService.getAggregate(START, END, null, null, null);

                List<Map<String, Object>> topSenders = dto.getTopSenders();
                assertNotNull(topSenders);
                assertEquals(2, topSenders.size());
                assertEquals("0xHIGH", topSenders.get(0).get("address"));
                assertEquals("0xLOW", topSenders.get(1).get("address"));
        }

        @Test
        void getAddressSummary_correctInflowOutflowCounts() {
                Transaction in1 = tx(1L, "0xEXT", "0xME", 10.0f, 0.5f);
                Transaction in2 = tx(2L, "0xEXT", "0xME", 20.0f, 0.3f);
                Transaction out1 = tx(3L, "0xME", "0xEXT", 5.0f, 0.1f);

                when(transactionRepository.findByToAddressAndTimestampBetween("0xME", START, END))
                                .thenReturn(List.of(in1, in2));
                when(transactionRepository.findByFromAddressAndTimestampBetween("0xME", START, END))
                                .thenReturn(List.of(out1));

                FlowAddressSummaryDto dto = flowService.getAddressSummary("0xME", START, END);

                assertEquals("0xME", dto.getAddress());
                assertEquals(30.0, dto.getTotalInflow(), 0.01);
                assertEquals(5.0, dto.getTotalOutflow(), 0.01);
                assertEquals(2, dto.getIncomingTxCount());
                assertEquals(1, dto.getOutgoingTxCount());
                assertEquals(0.1, dto.getTotalGasFees(), 0.01);
        }

        @Test
        void getTopHotspots_rankesByTransactionCountDescending() {
                List<Object[]> rows = new ArrayList<>();
                rows.add(new Object[] { "0xHOT", 3L, 6.0 });
                rows.add(new Object[] { "0xCOLD", 1L, 9.0 });
                when(transactionRepository.groupByReceiverBetween(START, END)).thenReturn(rows);
                when(transactionRepository.countByReceiverBetween(PRIOR_START, START))
                                .thenReturn(Collections.emptyList());
                when(labelRepository.findByAddressIn(anyList())).thenReturn(Collections.emptyList());

                HotspotPageDto page = flowService.getTopHotspots(START, END, PRIOR_START, null, null, 0, 100);
                List<HotspotDto> hotspots = page.getContent();

                assertEquals(2, hotspots.size());
                assertEquals("0xHOT", hotspots.get(0).getAddress());
                assertEquals(3, hotspots.get(0).getTransactionCount());
                assertEquals(6.0, hotspots.get(0).getTotalVolume(), 0.01);
                assertEquals(2.0, hotspots.get(0).getAvgTransactionValue(), 0.01);
                assertEquals("0xCOLD", hotspots.get(1).getAddress());
                assertEquals(1, hotspots.get(1).getTransactionCount());
        }

        @Test
        void getTopHotspots_respectsLimit() {
                List<Object[]> rows = new ArrayList<>();
                rows.add(new Object[] { "0xABC", 3L, 3.0 });
                rows.add(new Object[] { "0xDEF", 2L, 2.0 });
                rows.add(new Object[] { "0xGHI", 1L, 1.0 });
                when(transactionRepository.groupByReceiverBetween(START, END)).thenReturn(rows);
                when(transactionRepository.countByReceiverBetween(PRIOR_START, START))
                                .thenReturn(Collections.emptyList());
                when(labelRepository.findByAddressIn(anyList())).thenReturn(Collections.emptyList());

                HotspotPageDto page = flowService.getTopHotspots(START, END, PRIOR_START, null, null, 0, 2);
                List<HotspotDto> hotspots = page.getContent();

                assertEquals(2, hotspots.size());
        }

        @Test
        void getTopHotspots_attachesLabelWhenAvailable() {
                Label label = new Label();
                label.setAddress("0xLABELED");
                label.setLabelName("My Exchange");
                label.setCategory("Exchange");

                List<Object[]> rows = new ArrayList<>();
                rows.add(new Object[] { "0xLABELED", 1L, 5.0 });
                when(transactionRepository.groupByReceiverBetween(START, END)).thenReturn(rows);
                when(transactionRepository.countByReceiverBetween(PRIOR_START, START))
                                .thenReturn(Collections.emptyList());
                when(labelRepository.findByAddressIn(anyList())).thenReturn(List.of(label));

                HotspotPageDto page = flowService.getTopHotspots(START, END, PRIOR_START, null, null, 0, 100);
                List<HotspotDto> hotspots = page.getContent();

                assertEquals(1, hotspots.size());
                assertEquals("My Exchange", hotspots.get(0).getLabelName());
                assertEquals("Exchange", hotspots.get(0).getCategory());
        }

        @Test
        void getTopHotspots_unlabeledAddressDefaults() {
                List<Object[]> rows = new ArrayList<>();
                rows.add(new Object[] { "0xUNLABELED", 1L, 5.0 });
                when(transactionRepository.groupByReceiverBetween(START, END)).thenReturn(rows);
                when(transactionRepository.countByReceiverBetween(PRIOR_START, START))
                                .thenReturn(Collections.emptyList());
                when(labelRepository.findByAddressIn(anyList())).thenReturn(Collections.emptyList());

                HotspotPageDto page = flowService.getTopHotspots(START, END, PRIOR_START, null, null, 0, 100);
                List<HotspotDto> hotspots = page.getContent();

                assertEquals("Unlabeled", hotspots.get(0).getLabelName());
                assertEquals("Unknown", hotspots.get(0).getCategory());
        }

        @Test
        void getTransactionsForAddress_deduplicatesAndSortsByTimestampDesc() {
                Transaction t1 = tx(1L, "0xME", "0xOTHER", 1.0f, 0.1f);
                Transaction t2 = tx(2L, "0xOTHER", "0xME", 2.0f, 0.1f);

                when(transactionRepository.findByFromAddressAndTimestampBetween("0xME", START, END))
                                .thenReturn(List.of(t1));
                when(transactionRepository.findByToAddressAndTimestampBetween("0xME", START, END))
                                .thenReturn(List.of(t1, t2));

                List<Transaction> result = flowService.getTransactionsForAddress("0xME", START, END);

                assertEquals(2, result.size());
                assertTrue(result.get(0).getTimestamp().isAfter(result.get(1).getTimestamp())
                                || result.get(0).getTimestamp().isEqual(result.get(1).getTimestamp()));
        }

        // ── getVolumeTimeSeries tests ──

        @Test
        void getVolumeTimeSeries_mapsRowsCorrectly() {
                List<Object[]> rows = new ArrayList<>();
                rows.add(new Object[] { "2025-01-01T00:00:00Z", 5L });
                rows.add(new Object[] { "2025-01-01T01:00:00Z", 12L });
                when(transactionRepository.getVolumeByHour(START, END)).thenReturn(rows);

                List<Map<String, Object>> result = flowService.getVolumeTimeSeries(START, END);

                assertEquals(2, result.size());
                assertEquals("2025-01-01T00:00:00Z", result.get(0).get("ts"));
                assertEquals(5L, result.get(0).get("count"));
                assertEquals("2025-01-01T01:00:00Z", result.get(1).get("ts"));
                assertEquals(12L, result.get(1).get("count"));
        }

        @Test
        void getVolumeTimeSeries_emptyRowsReturnsEmptyList() {
                when(transactionRepository.getVolumeByHour(START, END)).thenReturn(Collections.emptyList());

                List<Map<String, Object>> result = flowService.getVolumeTimeSeries(START, END);

                assertTrue(result.isEmpty());
        }

        // ── getClusterStatistics tests ──

        @Test
        void getClusterStatistics_bucketsCorrectly() {
                List<Object[]> rows = new ArrayList<>();
                rows.add(new Object[] { "0xHIGH1", 25L, 100.0 }); // >20 → high
                rows.add(new Object[] { "0xHIGH2", 21L, 50.0 }); // >20 → high
                rows.add(new Object[] { "0xMED1", 10L, 30.0 }); // >5 → medium
                rows.add(new Object[] { "0xMED2", 6L, 20.0 }); // >5 → medium
                rows.add(new Object[] { "0xLOW1", 5L, 10.0 }); // ≤5 → low
                rows.add(new Object[] { "0xLOW2", 1L, 5.0 }); // ≤5 → low
                when(transactionRepository.groupByReceiverBetween(START, END)).thenReturn(rows);

                Map<String, Object> stats = flowService.getClusterStatistics(START, END);

                assertEquals(6, (Integer) stats.get("totalClusters"));
                assertEquals(2L, stats.get("highActivity"));
                assertEquals(2L, stats.get("mediumActivity"));
                assertEquals(2L, stats.get("lowActivity"));
        }

        @Test
        void getClusterStatistics_emptyDataReturnsZeros() {
                when(transactionRepository.groupByReceiverBetween(START, END)).thenReturn(Collections.emptyList());

                Map<String, Object> stats = flowService.getClusterStatistics(START, END);

                assertEquals(0, (Integer) stats.get("totalClusters"));
                assertEquals(0L, stats.get("highActivity"));
                assertEquals(0L, stats.get("mediumActivity"));
                assertEquals(0L, stats.get("lowActivity"));
        }

        @Test
        void getClusterStatistics_boundaryValues() {
                List<Object[]> rows = new ArrayList<>();
                rows.add(new Object[] { "0xEXACT20", 20L, 100.0 }); // exactly 20 → medium (not high)
                rows.add(new Object[] { "0xEXACT5", 5L, 50.0 }); // exactly 5 → low (not medium)
                when(transactionRepository.groupByReceiverBetween(START, END)).thenReturn(rows);

                Map<String, Object> stats = flowService.getClusterStatistics(START, END);

                assertEquals(2, (Integer) stats.get("totalClusters"));
                assertEquals(0L, stats.get("highActivity"));
                assertEquals(1L, stats.get("mediumActivity"));
                assertEquals(1L, stats.get("lowActivity"));
        }
}
