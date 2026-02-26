package edu.rit.NetworkActivity.web.controller;

import edu.rit.NetworkActivity.service.VeChainThorClient;
import edu.rit.NetworkActivity.service.dto.VeChainSummaryDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Map;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class VeChainControllerTest {

    @Mock VeChainThorClient client;
    @InjectMocks VeChainController veChainController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(veChainController).build();
    }

    // ── GET /api/vechain/status ───────────────────────────────────────────────

    @Test
    void statusReturnsCurrentBestBlock() throws Exception {
        VeChainSummaryDto dto = new VeChainSummaryDto();
        dto.setBestBlockNumber(18547892L);
        dto.setBestBlockId("0xabc123");
        dto.setBestBlockTimestamp(1700000000L);
        when(client.getSummary()).thenReturn(dto);

        mockMvc.perform(get("/api/vechain/status"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bestBlockNumber").value(18547892))
                .andExpect(jsonPath("$.bestBlockId").value("0xabc123"));
    }

    // ── GET /api/vechain/block/{id} ───────────────────────────────────────────

    @Test
    void blockByNumberReturnsBlockData() throws Exception {
        when(client.getBlock("18547892")).thenReturn(Map.of(
                "number", 18547892,
                "id", "0xabc123"
        ));

        mockMvc.perform(get("/api/vechain/block/18547892"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.number").value(18547892));
    }

    @Test
    void blockByHexIdReturnsBlockData() throws Exception {
        String blockId = "0xabc123def456";
        when(client.getBlock(blockId)).thenReturn(Map.of("id", blockId));

        mockMvc.perform(get("/api/vechain/block/" + blockId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(blockId));
    }

    @Test
    void blockNotFoundReturns404() throws Exception {
        when(client.getBlock("99999999")).thenReturn(null);

        mockMvc.perform(get("/api/vechain/block/99999999"))
                .andExpect(status().isNotFound());
    }

    // ── GET /api/vechain/tx/{id} ──────────────────────────────────────────────

    @Test
    void transactionByIdReturnsTxData() throws Exception {
        String txId = "0xfc99fe103fcc";
        when(client.getTransaction(txId)).thenReturn(Map.of("id", txId, "origin", "0x742d"));

        mockMvc.perform(get("/api/vechain/tx/" + txId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(txId));
    }

    @Test
    void transactionNotFoundReturns404() throws Exception {
        when(client.getTransaction("0xdeadbeef")).thenReturn(null);

        mockMvc.perform(get("/api/vechain/tx/0xdeadbeef"))
                .andExpect(status().isNotFound());
    }

    // ── GET /api/vechain/account/{address} ───────────────────────────────────

    @Test
    void accountReturnsBalanceData() throws Exception {
        String address = "0x742d35cc";
        when(client.getAccount(address)).thenReturn(Map.of(
                "balance", "0x56bc75e2d63100000",
                "hasCode", false
        ));

        mockMvc.perform(get("/api/vechain/account/" + address))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.hasCode").value(false));
    }
}
