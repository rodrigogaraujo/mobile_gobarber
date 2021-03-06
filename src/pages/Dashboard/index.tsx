import React from "react";
import { Button, View } from "react-native";

import { useAuth } from "../../hooks/Auth";

const Dashboard: React.FC = () => {
    const { signOut } = useAuth();
    return (
        <View>
            <Button title="Sair" onPress={signOut} />
        </View>
    );
};

export default Dashboard;
