package com.manati.squid.service;

import com.manati.squid.domain.Authority;
import com.manati.squid.domain.Order;
import com.manati.squid.repository.OrderRepository;
import com.manati.squid.repository.UserRepository;
import com.manati.squid.security.AuthoritiesConstants;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class for getting data for dashboards.
 */
@Service
@Transactional
public class DashboardService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public DashboardService(UserRepository userRepository, OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    public Map<String, Integer> getUsersDistribution() {
        Authority authority = new Authority();

        authority.setName(AuthoritiesConstants.OPERATOR);
        Integer operators = userRepository.countUserByAuthorities(authority);

        authority.setName(AuthoritiesConstants.USER);
        Integer users = userRepository.countUserByAuthorities(authority);

        authority.setName(AuthoritiesConstants.BUSINESSADMIN);
        Integer admins = userRepository.countUserByAuthorities(authority);

        Map<String, Integer> hm = new HashMap<String, Integer>();
        hm.put(AuthoritiesConstants.OPERATOR, operators);
        hm.put(AuthoritiesConstants.USER, users);
        hm.put(AuthoritiesConstants.BUSINESSADMIN, admins);

        return hm;
    }

    private static DecimalFormat df2 = new DecimalFormat("#.##");

    public List<List<String>> getPopularBrandByOrders() {
        var brands = orderRepository.getVehiclesOrderBrandName();
        var count = orderRepository.getVehiclesOrderBrandCount();
        List<List<String>> myList = new ArrayList<>();

        myList.add(brands);
        myList.add(count);

        List<String> ordersCount = new ArrayList<>();
        var total = orderRepository.getOrdersCount();

        float percentage;
        for (String c : count) {
            percentage = Integer.parseInt(c);
            percentage = (percentage / total) * 100;
            ordersCount.add(df2.format(percentage) + "%");
        }

        myList.add(ordersCount);
        return myList;
    }

    public String getPercentageOfOrdersStatus(String status) {
        float total = (float) orderRepository.getOrdersCount();
        float totalStatus = (float) orderRepository.getOrdersCountByStatus(status);
        float percentage = (totalStatus / total) * 100;
        return df2.format(percentage);
    }
}
